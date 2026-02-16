const Booking = require('../../bookings/booking.model');
const { AppError } = require('../../../common/utils/appError');

const validateStatusTransition = (current, next) => {
    const flow = {
        ASSIGNED: ['IN_PROGRESS'],
        IN_PROGRESS: ['COMPLETED'],
    };

    if (!flow[current]?.includes(next)) {
        throw new AppError('Invalid status transition', 400);
    }
};

exports.getMyJobs = async (user) => {
    if (user.role === 'ADMIN') {
        return Booking.find({ technicianId: { $ne: null } })
            .populate('technicianId', 'name mobile')
            .lean();
    }

    return Booking.find({ technicianId: user._id })
        .populate('technicianId', 'name mobile')
        .lean();
};

exports.updateJobStatus = async ({ bookingId, status }, user) => {
    const booking = await Booking.findOne({ bookingId });

    if (!booking) throw new AppError('Booking not found', 404);

    /**
     * Technician can only update own booking
     */
    if (
        user.role === 'TECHNICIAN' &&
        booking.technicianId?.toString() !== user._id.toString()
    ) {
        throw new AppError('Not allowed to update this job', 403);
    }

    validateStatusTransition(booking.status, status);

    booking.status = status;
    await booking.save();

    return booking;
};
