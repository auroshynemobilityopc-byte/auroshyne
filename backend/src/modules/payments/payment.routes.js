const router = require('express').Router();

const paymentController = require('./payment.controller');
const { protect } = require('../../common/middleware/auth.middleware');
const { allowRoles } = require('../../common/middleware/role.middleware');
const { ADMIN } = require('../../common/constants/roles');

/**
 * 🔒 ADMIN ONLY
 */
router.use(protect);
router.use(allowRoles(ADMIN));

/**
 * @swagger
 * /payments:
 *   patch:
 *     summary: Update payment
 *     tags: [Payments]
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
 *         description: Payment updated successfully
 */
router.patch('/', paymentController.updatePayment);

module.exports = router;
