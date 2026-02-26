const router = require('express').Router();

const discountController = require('./discount.controller');
const { protect } = require('../../common/middleware/auth.middleware');
const { allowRoles } = require('../../common/middleware/role.middleware');
const { ADMIN, CUSTOMER } = require('../../common/constants/roles');

/**
 * 🟢 PUBLIC READ (CUSTOMER OR ANYONE)
 */

router.get('/', protect, allowRoles(CUSTOMER, ADMIN), discountController.getDiscounts);

router.get('/:id', protect, allowRoles(CUSTOMER, ADMIN), discountController.getDiscountById);

router.post('/validate', protect, allowRoles(CUSTOMER, ADMIN), discountController.validateDiscount);

/**
 * 🔒 ADMIN ONLY (WRITE)
 */

router.post('/', protect, allowRoles(ADMIN), discountController.createDiscount);

router.patch('/:id', protect, allowRoles(ADMIN), discountController.updateDiscount);

router.delete('/:id', protect, allowRoles(ADMIN), discountController.deleteDiscount);

module.exports = router;
