const Booking = require('../bookings/booking.model');
const { AppError } = require('../../common/utils/appError');

const validatePaymentTransition = (current, next) => {
    const flow = {
        UNPAID: ['PAID', 'FAILED'],
        PAID: ['REFUND_INITIATED'],
        REFUND_INITIATED: ['REFUNDED'],
    };

    if (!flow[current]?.includes(next)) {
        throw new AppError('Invalid payment status transition', 400);
    }
};

exports.updatePayment = async ({
    bookingId,
    method,
    status,
    transactionId,
}) => {
    const booking = await Booking.findOne({ bookingId });

    if (!booking) throw new AppError('Booking not found', 404);

    validatePaymentTransition(booking.payment.status, status);

    booking.payment = {
        method,
        status,
        transactionId,
    };

    await booking.save();

    return booking;
};
