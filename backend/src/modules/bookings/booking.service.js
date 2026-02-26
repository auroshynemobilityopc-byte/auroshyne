const mongoose = require('mongoose');
const Booking = require('./booking.model');
const Service = require('../services/service.model');
const Addon = require('../addons/addon.model');
const Technician = require('../technicians/technician.model');
const slotConfig = require('../../config/slot.config');
const { AppError } = require('../../common/utils/appError');
const notificationService = require('../notifications/notification.service');
const discountService = require('../discounts/discount.service');

/* ---------------- HELPERS ---------------- */

const calculateVehiclePrice = async (vehicle) => {
    const service = await Service.findById(vehicle.serviceId).lean();
    if (!service || !service.isActive) {
        throw new AppError('Invalid service', 400);
    }

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

const checkDuplicateVehicle = async (vehicles, date, slot, session) => {
    const numbers = vehicles.map((v) => v.number);

    if (new Set(numbers).size !== numbers.length) {
        throw new AppError('Duplicate vehicle in request', 400);
    }

    const existing = await Booking.findOne({
        date,
        slot,
        status: { $ne: 'CANCELLED' },
        'vehicles.number': { $in: numbers },
    })
        .session(session)
        .lean();

    if (existing) {
        throw new AppError(`Vehicle already booked for ${date} ${slot}`, 400);
    }
};

const checkSlotCapacityTx = async (date, slot, count, session) => {
    const existing = await Booking.countDocuments({ date, slot }).session(session);
    const capacity = slotConfig[slot].capacity;

    if (existing + count > capacity) {
        throw new AppError('Slot capacity exceeded', 400);
    }
};

const calculateDiscount = (totalAmount, vehicleCount) => {
    let discount = 0;

    if (vehicleCount === 2) discount = totalAmount * 0.05;
    if (vehicleCount >= 3) discount = totalAmount * 0.1;

    return discount;
};

/* ---------------- CREATE BOOKING ---------------- */

exports.createBooking = async (payload, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await checkDuplicateVehicle(payload.vehicles, payload.date, payload.slot, session);
        await checkSlotCapacityTx(payload.date, payload.slot, payload.vehicles.length, session);

        let totalAmount = 0;
        const vehicles = [];

        for (const v of payload.vehicles) {
            const price = await calculateVehiclePrice(v);
            totalAmount += price;
            vehicles.push({ ...v, price });
        }

        let discount = calculateDiscount(totalAmount, vehicles.length);

        if (payload.discountCode) {
            const discountObj = await discountService.validateDiscountCode(payload.discountCode, totalAmount);
            let codeDiscount = discountObj.type === 'percentage'
                ? totalAmount * (discountObj.value / 100)
                : discountObj.value;

            if (discountObj.maxDiscount && codeDiscount > discountObj.maxDiscount) {
                codeDiscount = discountObj.maxDiscount;
            }

            if (codeDiscount > discount) discount = codeDiscount;

            await mongoose.model('Discount').updateOne(
                { _id: discountObj._id },
                { $inc: { usedCount: 1 } },
                { session }
            );
        }

        const finalAmount = totalAmount - discount;

        const booking = await Booking.create(
            [
                {
                    ...payload,
                    userId,
                    payment: {
                        method: payload.paymentMode || null,
                        status: 'UNPAID',
                    },
                    vehicles,
                    totalAmount: finalAmount,
                    discount,
                    isBulk: vehicles.length > 1,
                },
            ],
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        return booking[0];
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
};

/* ---------------- BULK BOOKING ---------------- */

exports.bulkBooking = async (payload, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        for (const b of payload.bookings) {
            await checkDuplicateVehicle(b.vehicles, b.date, b.slot, session);
            await checkSlotCapacityTx(b.date, b.slot, b.vehicles.length, session);
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

            let discount = calculateDiscount(totalAmount, vehicles.length);

            if (b.discountCode) {
                const discountObj = await discountService.validateDiscountCode(b.discountCode, totalAmount);
                let codeDiscount = discountObj.type === 'percentage'
                    ? totalAmount * (discountObj.value / 100)
                    : discountObj.value;

                if (discountObj.maxDiscount && codeDiscount > discountObj.maxDiscount) {
                    codeDiscount = discountObj.maxDiscount;
                }

                if (codeDiscount > discount) discount = codeDiscount;

                await mongoose.model('Discount').updateOne(
                    { _id: discountObj._id },
                    { $inc: { usedCount: 1 } },
                    { session }
                );
            }

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
                        isBulk: vehicles.length > 1,
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

/* ---------------- ASSIGN TECHNICIAN ---------------- */

exports.assignTechnician = async ({ bookingId, technicianId }) => {
    const booking = await Booking.findOne({ bookingId });
    if (!booking) throw new AppError('Booking not found', 404);

    if (booking.status === 'COMPLETED') {
        throw new AppError('Completed booking cannot be modified', 400);
    }

    const technician = await Technician.findById(technicianId);
    if (!technician || !technician.isActive) {
        throw new AppError('Invalid technician', 400);
    }

    const alreadyAssigned = technician.assignedSlots.some(
        (s) => s.date === booking.date && s.slot === booking.slot
    );

    if (alreadyAssigned) {
        throw new AppError('Technician already assigned for this slot', 400);
    }

    booking.technicianId = technicianId;
    booking.status = 'ASSIGNED';

    technician.assignedSlots.push({
        date: booking.date,
        slot: booking.slot,
    });

    await technician.save();
    await booking.save();

    notificationService
        .notifyTechnicianAssigned({
            userId: booking.userId,
            bookingId: booking.bookingId,
            technicianName: technician.name,
            date: booking.date,
            slot: booking.slot,
        })
        .catch((err) =>
            console.error(
                '[Notification] Failed to create technician-assigned notification:',
                err.message
            )
        );

    return booking;
};

/* ---------------- UPDATE STATUS ---------------- */

exports.updateBookingStatus = async ({ bookingId, status }) => {
    const booking = await Booking.findOne({ bookingId });
    if (!booking) throw new AppError('Booking not found', 404);

    if (booking.status === 'COMPLETED') {
        throw new AppError('Completed booking cannot be modified', 400);
    }

    validateStatusTransition(booking.status, status);

    booking.status = status;
    await booking.save();

    return booking;
};

/* ---------------- UPDATE PAYMENT ---------------- */

exports.updatePayment = async ({ bookingId, method, status, transactionId }) => {
    const booking = await Booking.findOne({ bookingId });
    if (!booking) throw new AppError('Booking not found', 404);

    if (booking.status === 'COMPLETED' && status !== 'REFUND_INITIATED') {
        throw new AppError('Payment cannot be modified for completed booking', 400);
    }

    booking.payment.method = method;
    booking.payment.status = status;

    if (transactionId !== undefined) {
        booking.payment.transactionId = transactionId;
    }

    await booking.save();
    return booking;
};

/* ---------------- GET BOOKINGS ---------------- */

exports.getBookings = async (filters, page, limit) => {
    const skip = (page - 1) * limit;

    const query = {};

    if (filters.date) {
        // `date` is stored as a plain string ("YYYY-MM-DD") in the model,
        // so use an exact string match — not a Date-range query.
        query.date = filters.date;
    }

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

/* ---------------- GET BY ID ---------------- */

exports.getBookingById = async (id) => {
    const booking = await Booking.findOne({ bookingId: id })
        .populate('technicianId', 'name mobile')
        .populate('userId', 'name mobile')
        .populate('vehicles.serviceId', 'name price')
        .populate('vehicles.addons', 'name price')
        .lean();

    if (!booking) throw new AppError('Booking not found', 404);
    return booking;
};

/* ---------------- GET SLOT BOOKINGS ---------------- */

exports.getSlotBookings = async (date, slot) => {
    return Booking.find({ date, slot }).lean();
};

/* ---------------- MY BOOKINGS ---------------- */

exports.getMyBookings = async (userId) => {
    return Booking.find({ userId })
        .populate('technicianId', 'name mobile')
        .lean();
};

/* ---------------- CANCEL ---------------- */

exports.cancelBooking = async (bookingId, userId) => {
    const booking = await Booking.findOne({ bookingId });
    if (!booking) throw new AppError('Booking not found', 404);

    if (String(booking.userId) !== String(userId)) {
        throw new AppError('Unauthorized', 403);
    }

    if (!['PENDING'].includes(booking.status)) {
        throw new AppError('Only PENDING bookings can be cancelled', 400);
    }

    booking.status = 'CANCELLED';
    await booking.save();

    return booking;
};

/* ---------------- REFUND ---------------- */

exports.requestRefund = async (bookingId, userId, reason) => {
    const booking = await Booking.findOne({ bookingId });
    if (!booking) throw new AppError('Booking not found', 404);

    if (String(booking.userId) !== String(userId)) {
        throw new AppError('Unauthorized', 403);
    }

    if (booking.status !== 'CANCELLED') {
        throw new AppError('Only CANCELLED bookings can request refund', 400);
    }

    if (booking.payment.status !== 'PAID') {
        throw new AppError('No paid payment to refund', 400);
    }

    booking.payment.status = 'REFUND_INITIATED';
    booking.refundReason = reason || '';

    await booking.save();
    return booking;
};