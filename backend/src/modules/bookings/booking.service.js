const mongoose = require('mongoose');
const Booking = require('./booking.model');
const Service = require('../services/service.model');
const Addon = require('../addons/addon.model');
const Technician = require('../technicians/technician.model');
const slotConfig = require('../../config/slot.config');
const { AppError } = require('../../common/utils/appError');

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
    if (filters.paymentStatus)
        query['payment.status'] = filters.paymentStatus;

    const [data, total] = await Promise.all([
        Booking.find(query)
            .populate('technicianId', 'name mobile')
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
