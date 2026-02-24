const mongoose = require('mongoose');
const Booking = require('./booking.model');
const Service = require('../services/service.model');
const Addon = require('../addons/addon.model');
const Technician = require('../technicians/technician.model');
const slotConfig = require('../../config/slot.config');
const { AppError } = require('../../common/utils/appError');
const notificationService = require('../notifications/notification.service');

const calculateVehiclePrice = async (vehicle) => {
    const service = await Service.findById(vehicle.serviceId).lean();
    if (!service || !service.isActive)
        throw new AppError('Invalid service', 400);

    let addonsTotal = 0;

    if (vehicle.addons?.length) {
        const addons = await Addon.find({
            _id: { $in: vehicle.addons },
            isActive: true,
        }).lean();

        addonsTotal = addons.reduce((sum, a) => sum + a.price, 0);
    }

    return service.price + addonsTotal;
};

const checkSlotCapacity = async (date, slot, count) => {
    const existing = await Booking.countDocuments({ date, slot });
    const capacity = slotConfig[slot].capacity;

    if (existing + count > capacity) {
        throw new AppError('Slot capacity exceeded', 400);
    }
};

const validateStatusTransition = (current, next) => {
    const flow = {
        PENDING: ['ASSIGNED', 'CANCELLED'],
        ASSIGNED: ['IN_PROGRESS', 'CANCELLED'],
        IN_PROGRESS: ['COMPLETED'],
    };

    if (!flow[current]?.includes(next)) {
        throw new AppError('Invalid status transition', 400);
    }
};

exports.createBooking = async (payload, userId) => {
    await checkDuplicateVehicle(payload.vehicles, payload.date, payload.slot);
    await checkSlotCapacity(payload.date, payload.slot, 1);

    let totalAmount = 0;

    const vehicles = [];

    for (const v of payload.vehicles) {
        const price = await calculateVehiclePrice(v);
        totalAmount += price;

        vehicles.push({ ...v, price });
    }

    const booking = await Booking.create({
        ...payload,
        userId,
        payment: {
            method: payload.paymentMode || null,
            status: 'UNPAID',
        },
        vehicles,
        totalAmount,
        isBulk: payload.vehicles.length > 1,
    });

    return booking;
};

exports.bulkBooking = async (payload, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        for (const b of payload.bookings) {
            await checkDuplicateVehicle(b.vehicles, b.date, b.slot);
            await checkSlotCapacity(b.date, b.slot, 1);
        }

        const results = [];

        for (const b of payload.bookings) {
            let totalAmount = 0;
            const vehicles = [];

            for (const v of b.vehicles) {
                const price = await calculateVehiclePrice(v);
                totalAmount += price;
                vehicles.push({ ...v, price });
            }

            // 🔻 bulk vehicle discount inside each booking
            let discount = 0;
            const vehicleCount = vehicles.length;

            if (vehicleCount === 2) discount = totalAmount * 0.05;
            if (vehicleCount >= 3) discount = totalAmount * 0.1;

            const finalAmount = totalAmount - discount;

            const booking = await Booking.create(
                [
                    {
                        ...b,
                        userId,
                        payment: {
                            method: b.paymentMode || null,
                            status: 'UNPAID',
                        },
                        vehicles,
                        totalAmount: finalAmount,
                        discount,
                        isBulk: vehicleCount > 1,
                    },
                ],
                { session }
            );

            results.push(booking[0]);
        }

        await session.commitTransaction();
        session.endSession();

        return results;
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
};

exports.assignTechnician = async ({ bookingId, technicianId }) => {
    const booking = await Booking.findOne({ bookingId });
    if (!booking) throw new AppError('Booking not found', 404);

    const technician = await Technician.findById(technicianId);
    if (!technician || !technician.isActive)
        throw new AppError('Invalid technician', 400);

    booking.technicianId = technicianId;
    booking.status = 'ASSIGNED';

    technician.assignedSlots.push({
        date: booking.date,
        slot: booking.slot,
    });

    await technician.save();
    await booking.save();

    // 🔔 Notify the customer that a technician has been assigned
    // We fire-and-forget so a notification failure never blocks the response.
    notificationService
        .notifyTechnicianAssigned({
            userId: booking.userId,
            bookingId: booking.bookingId,
            technicianName: technician.name,
            date: booking.date,
            slot: booking.slot,
        })
        .catch((err) =>
            console.error('[Notification] Failed to create technician-assigned notification:', err.message)
        );

    return booking;
};

exports.updateBookingStatus = async ({ bookingId, status }) => {
    const booking = await Booking.findOne({ bookingId });
    if (!booking) throw new AppError('Booking not found', 404);

    validateStatusTransition(booking.status, status);

    booking.status = status;
    await booking.save();

    return booking;
};

exports.updatePayment = async ({
    bookingId,
    method,
    status,
    transactionId,
}) => {
    const booking = await Booking.findOne({ bookingId });
    if (!booking) throw new AppError('Booking not found', 404);

    booking.payment = { method, status, transactionId };

    await booking.save();
    return booking;
};

exports.getBookings = async (filters, page, limit) => {
    const skip = (page - 1) * limit;

    const query = {};

    if (filters.date) query.date = filters.date;
    if (filters.slot) query.slot = filters.slot;
    if (filters.status) query.status = filters.status;
    if (filters.paymentStatus) query['payment.status'] = filters.paymentStatus;
    if (filters.isAssigned === 'true') {
        query.technicianId = { $ne: null };
    } else if (filters.isAssigned === 'false') {
        query.technicianId = null;
    }

    const [data, total] = await Promise.all([
        Booking.find(query)
            .populate('technicianId', 'name mobile')
            .populate('userId', 'name mobile')
            .skip(skip)
            .limit(limit)
            .lean(),
        Booking.countDocuments(query),
    ]);

    return {
        data,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        },
    };
};

exports.getBookingById = async (id) => {
    const booking = await Booking.findOne({ bookingId: id })
        .populate('technicianId', 'name mobile')
        .lean();

    if (!booking) throw new AppError('Booking not found', 404);
    return booking;
};

exports.getSlotBookings = async (date, slot) => {
    return Booking.find({ date, slot }).lean();
};

exports.getMyBookings = async (userId) => {
    return Booking.find({ userId })
        .populate('technicianId', 'name mobile')
        .lean();
};

const checkDuplicateVehicle = async (vehicles, date, slot) => {
    const numbers = vehicles.map((v) => v.number);

    const uniqueNumbers = new Set(numbers);
    if (uniqueNumbers.size !== numbers.length) {
        throw new AppError('Duplicate vehicle in request', 400);
    }

    const existing = await Booking.findOne({
        date,
        slot,
        status: { $ne: 'CANCELLED' },
        'vehicles.number': { $in: numbers },
    }).lean();

    if (existing) {
        throw new AppError(
            `Vehicle already booked for ${date} ${slot}`,
            400
        );
    }
};

exports.cancelBooking = async (bookingId, userId) => {
    const booking = await Booking.findOne({ bookingId });
    if (!booking) throw new AppError('Booking not found', 404);
    if (String(booking.userId) !== String(userId))
        throw new AppError('Unauthorized', 403);
    if (!['PENDING'].includes(booking.status))
        throw new AppError('Only PENDING bookings can be cancelled', 400);

    booking.status = 'CANCELLED';
    await booking.save();
    return booking;
};

exports.requestRefund = async (bookingId, userId, reason) => {
    const booking = await Booking.findOne({ bookingId });
    if (!booking) throw new AppError('Booking not found', 404);
    if (String(booking.userId) !== String(userId))
        throw new AppError('Unauthorized', 403);
    if (booking.status !== 'CANCELLED')
        throw new AppError('Only CANCELLED bookings can request refund', 400);
    if (booking.payment.status !== 'PAID')
        throw new AppError('No paid payment to refund', 400);

    booking.payment.status = 'REFUND_INITIATED';
    booking.refundReason = reason || '';
    await booking.save();
    return booking;
};

exports.updateBookingByCustomer = async (bookingId, userId, updates) => {
    const booking = await Booking.findOne({ bookingId });
    if (!booking) throw new AppError('Booking not found', 404);
    if (String(booking.userId) !== String(userId))
        throw new AppError('Unauthorized', 403);
    if (!['PENDING'].includes(booking.status))
        throw new AppError('Booking cannot be edited at this stage', 400);

    // Address / mobile
    if (updates.customer) {
        if (updates.customer.address) booking.customer.address = updates.customer.address;
        if (updates.customer.mobile) booking.customer.mobile = updates.customer.mobile;
        if (updates.customer.apartmentName !== undefined) booking.customer.apartmentName = updates.customer.apartmentName;
    }

    // Per-vehicle edits
    if (updates.vehicles && Array.isArray(updates.vehicles)) {
        for (const upd of updates.vehicles) {
            const v = booking.vehicles.find(bv => bv.number === upd.originalNumber);
            if (!v) continue;
            if (upd.number) v.number = upd.number;
            if (upd.model !== undefined) v.model = upd.model;
            const newServiceId = upd.serviceId || v.serviceId;
            const newAddons = upd.addons !== undefined ? upd.addons : v.addons;
            if (upd.serviceId || upd.addons !== undefined) {
                v.serviceId = newServiceId;
                v.addons = newAddons;
                v.price = await calculateVehiclePrice({ serviceId: newServiceId, addons: newAddons });
            }
        }
        booking.totalAmount = booking.vehicles.reduce((s, v) => s + v.price, 0);
    }

    await booking.save();
    return booking;
};
