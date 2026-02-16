const Booking = require('../bookings/booking.model');

const todayDate = () => new Date().toISOString().split('T')[0];

exports.getSummary = async () => {
    const today = todayDate();

    const [
        total,
        pending,
        assigned,
        completed,
        cancelled,
        todayBookings,
        todayPaidBookings,
    ] = await Promise.all([
        Booking.countDocuments(),
        Booking.countDocuments({ status: 'PENDING' }),
        Booking.countDocuments({ status: 'ASSIGNED' }),
        Booking.countDocuments({ status: 'COMPLETED' }),
        Booking.countDocuments({ status: 'CANCELLED' }),

        Booking.find({ date: today }).lean(),

        Booking.find({
            date: today,
            'payment.status': 'PAID',
        }).lean(),
    ]);

    /**
     * TODAY REVENUE
     */
    const todayRevenue = todayPaidBookings.reduce(
        (sum, b) => sum + b.totalAmount,
        0
    );

    /**
     * SLOT COUNTS (TODAY)
     */
    const slotCounts = {
        MORNING: 0,
        AFTERNOON: 0,
        EVENING: 0,
    };

    todayBookings.forEach((b) => {
        if (slotCounts[b.slot] !== undefined) {
            slotCounts[b.slot]++;
        }
    });

    return {
        total,
        pending,
        assigned,
        completed,
        cancelled,
        todayRevenue,
        slotCounts,
    };
};
