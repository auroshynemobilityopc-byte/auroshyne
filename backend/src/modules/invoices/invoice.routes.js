const router = require('express').Router();

const invoiceController = require('./invoice.controller');
const { protect } = require('../../common/middleware/auth.middleware');
const { allowRoles } = require('../../common/middleware/role.middleware');
const { ADMIN, CUSTOMER } = require('../../common/constants/roles');

/**
 * 🔐 ALL LOGIN REQUIRED
 */
router.use(protect);

/**
 * 🟢 CUSTOMER → only their invoice (ownership check can be added)
 * 🔒 ADMIN → any invoice
 */

/**
 * @swagger
 * /invoices/generate/{bookingId}:
 *   get:
 *     summary: Generate invoice for a booking
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice generated successfully
 */
router.get(
    '/generate/:bookingId',
    allowRoles(ADMIN, CUSTOMER),
    invoiceController.generateInvoice
);

/**
 * @swagger
 * /invoices/download/{fileName}:
 *   get:
 *     summary: Download invoice
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice downloaded successfully
 */
router.get(
    '/download/:fileName',
    allowRoles(ADMIN, CUSTOMER),
    invoiceController.downloadInvoice
);

module.exports = router;
