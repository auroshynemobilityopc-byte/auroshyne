const router = require('express').Router();

const bookingController = require('./booking.controller');
const { protect } = require('../../common/middleware/auth.middleware');
const { allowRoles } = require('../../common/middleware/role.middleware');
const { ADMIN, CUSTOMER } = require('../../common/constants/roles');
const { bookingLimiter } = require('../../common/middleware/rateLimit.middleware');

router.use(protect);

router.post('/', allowRoles(CUSTOMER, ADMIN), bookingLimiter, bookingController.createBooking);

router.get('/my', allowRoles(CUSTOMER), bookingLimiter, bookingController.getMyBookings);

router.get(
    '/slot/:date/:slot',
    allowRoles(CUSTOMER, ADMIN),
    bookingLimiter,
    bookingController.getSlotBookings
);

router.post('/bulk', allowRoles(CUSTOMER, ADMIN), bookingLimiter, bookingController.bulkBooking);

router.get('/', allowRoles(ADMIN), bookingController.getBookings);

router.get('/:id', allowRoles(ADMIN), bookingController.getBookingById);

router.patch(
    '/assign-technician',
    allowRoles(ADMIN),
    bookingController.assignTechnician
);

router.patch(
    '/status',
    allowRoles(ADMIN),
    bookingController.updateBookingStatus
);

router.patch(
    '/payment',
    allowRoles(ADMIN),
    bookingController.updatePayment
);

module.exports = router;
