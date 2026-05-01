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

router.get(
    '/slot-availability/:date/:slot',
    allowRoles(CUSTOMER, ADMIN),
    bookingLimiter,
    bookingController.checkSlotAvailability
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

router.patch('/payment', allowRoles(ADMIN), bookingController.updatePayment);

router.patch(
    '/services',
    allowRoles(ADMIN),
    bookingController.updateBookingServices
);

// Customer self-service
router.patch('/my/cancel', allowRoles(CUSTOMER), bookingLimiter, bookingController.cancelBooking);
router.patch('/my/refund', allowRoles(CUSTOMER), bookingLimiter, bookingController.requestRefund);
router.patch('/my/edit', allowRoles(CUSTOMER), bookingLimiter, bookingController.updateBookingByCustomer);

// Payment Integration (Cashfree)
router.post('/payment/create-order', allowRoles(CUSTOMER), bookingLimiter, bookingController.createCashfreeOrder);
router.post('/payment/verify', allowRoles(CUSTOMER), bookingLimiter, bookingController.verifyCashfreePayment);

router.delete(
    '/payment/failed-booking/:bookingId',
    protect,
    allowRoles(CUSTOMER),
    bookingLimiter,
    bookingController.deleteFailedBooking
);

module.exports = router;
