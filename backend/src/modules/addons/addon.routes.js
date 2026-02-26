const router = require('express').Router();

const addonController = require('./addon.controller');
const { protect } = require('../../common/middleware/auth.middleware');
const { allowRoles } = require('../../common/middleware/role.middleware');
const { ADMIN, CUSTOMER } = require('../../common/constants/roles');

/**
 * 🟢 PUBLIC READ (CUSTOMER OR ANYONE)
 */

router.get('/', addonController.getAddons);

router.get('/:id', protect, allowRoles(CUSTOMER, ADMIN), addonController.getAddonById);

router.get('/vehicleType/:vehicleType', protect, allowRoles(CUSTOMER, ADMIN), addonController.getAddonsByVehicleType);

/**
 * 🔒 ADMIN ONLY (WRITE)
 */

router.post('/', protect, allowRoles(ADMIN), addonController.createAddon);

router.patch('/:id', protect, allowRoles(ADMIN), addonController.updateAddon);

router.delete('/:id', protect, allowRoles(ADMIN), addonController.deleteAddon);

module.exports = router;
