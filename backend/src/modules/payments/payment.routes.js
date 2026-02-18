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

router.patch('/', paymentController.updatePayment);

module.exports = router;
