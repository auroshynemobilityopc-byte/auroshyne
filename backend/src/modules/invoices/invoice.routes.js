const router = require('express').Router();

const invoiceController = require('./invoice.controller');
const { protect } = require('../../common/middleware/auth.middleware');
const { allowRoles } = require('../../common/middleware/role.middleware');
const { ADMIN, CUSTOMER } = require('../../common/constants/roles');


router.use(protect);

router.get(
    '/generate/:bookingId',
    allowRoles(ADMIN, CUSTOMER),
    invoiceController.generateInvoice
);

module.exports = router;
