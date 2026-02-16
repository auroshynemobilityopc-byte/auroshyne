const router = require('express').Router();

const bookingController = require('./booking.controller');
const { protect } = require('../../common/middleware/auth.middleware');
const { allowRoles } = require('../../common/middleware/role.middleware');
const { ADMIN, CUSTOMER } = require('../../common/constants/roles');
const { bookingLimiter } = require('../../common/middleware/rateLimit.middleware');

/**
 * 🔐 ALL ROUTES REQUIRE LOGIN
 */
router.use(protect);

/**
 * 🟢 CUSTOMER ROUTES
 */

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create new booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [service, date, slot]
 *             properties:
 *               service:
 *                 type: string
 *                 example: 60d5ec49f9f14b001c8e4d1a
 *               date:
 *                 type: string
 *                 example: 2022-01-01
 *               slot:
 *                 type: string
 *                 example: 10:00-11:00
 *     responses:
 *       201:
 *         description: Booking created successfully
 */
router.post('/', allowRoles(CUSTOMER, ADMIN), bookingLimiter, bookingController.createBooking);

/**
 * @swagger
 * /bookings/my:
 *   get:
 *     summary: Get my bookings
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: Bookings fetched successfully
 */
router.get('/my', allowRoles(CUSTOMER), bookingLimiter, bookingController.getMyBookings);

/**
 * @swagger
 * /bookings/slot/{date}/{slot}:
 *   get:
 *     summary: Get slot bookings
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           example: 2022-01-01
 *       - in: path
 *         name: slot
 *         required: true
 *         schema:
 *           type: string
 *           example: 10:00-11:00
 *     responses:
 *       200:
 *         description: Slot bookings fetched successfully
 */
router.get(
    '/slot/:date/:slot',
    allowRoles(CUSTOMER, ADMIN),
    bookingLimiter,
    bookingController.getSlotBookings
);

/**
 * @swagger
 * /bookings/bulk:
 *   post:
 *     summary: Create bulk bookings
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookings]
 *             properties:
 *               bookings:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [service, date, slot]
 *                   properties:
 *                     service:
 *                       type: string
 *                       example: 60d5ec49f9f14b001c8e4d1a
 *                     date:
 *                       type: string
 *                       example: 2022-01-01
 *                     slot:
 *                       type: string
 *                       example: 10:00-11:00
 *     responses:
 *       201:
 *         description: Bulk bookings created successfully
 */
router.post('/bulk', allowRoles(CUSTOMER, ADMIN), bookingLimiter, bookingController.bulkBooking);

/**
 * 🔒 ADMIN ROUTES
 */

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: Bookings fetched successfully
 */
router.get('/', allowRoles(ADMIN), bookingController.getBookings);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking fetched successfully
 */
router.get('/:id', allowRoles(ADMIN), bookingController.getBookingById);

/**
 * @swagger
 * /bookings/assign-technician:
 *   patch:
 *     summary: Assign technician to booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookingId, technicianId]
 *             properties:
 *               bookingId:
 *                 type: string
 *                 example: 60d5ec49f9f14b001c8e4d1a
 *               technicianId:
 *                 type: string
 *                 example: 60d5ec49f9f14b001c8e4d1b
 *     responses:
 *       200:
 *         description: Technician assigned successfully
 */
router.patch(
    '/assign-technician',
    allowRoles(ADMIN),
    bookingController.assignTechnician
);

/**
 * @swagger
 * /bookings/status:
 *   patch:
 *     summary: Update booking status
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookingId, status]
 *             properties:
 *               bookingId:
 *                 type: string
 *                 example: 60d5ec49f9f14b001c8e4d1a
 *               status:
 *                 type: string
 *                 example: completed
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 */
router.patch(
    '/status',
    allowRoles(ADMIN),
    bookingController.updateBookingStatus
);

/**
 * @swagger
 * /bookings/payment:
 *   patch:
 *     summary: Update booking payment
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookingId, payment]
 *             properties:
 *               bookingId:
 *                 type: string
 *                 example: 60d5ec49f9f14b001c8e4d1a
 *               payment:
 *                 type: string
 *                 example: completed
 *     responses:
 *       200:
 *         description: Booking payment updated successfully
 */
router.patch(
    '/payment',
    allowRoles(ADMIN),
    bookingController.updatePayment
);

module.exports = router;
