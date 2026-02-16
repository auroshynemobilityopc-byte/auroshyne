const router = require('express').Router();

const addonController = require('./addon.controller');
const { protect } = require('../../common/middleware/auth.middleware');
const { allowRoles } = require('../../common/middleware/role.middleware');
const { ADMIN, CUSTOMER } = require('../../common/constants/roles');

/**
 * 🔐 ALL ROUTES REQUIRE LOGIN
 */
router.use(protect);

/**
 * 🟢 CUSTOMER + ADMIN (READ ONLY)
 */

// @desc Get all addons
// @route GET /api/addons
// @access Private
router.get('/', allowRoles(CUSTOMER, ADMIN), addonController.getAddons);

// @desc Get addon by id
// @route GET /api/addons/:id
// @access Private
router.get('/:id', allowRoles(CUSTOMER, ADMIN), addonController.getAddonById);

// @desc Get addons by vehicle type
// @route GET /api/addons/vehicleType/:vehicleType
// @access Private
router.get('/vehicleType/:vehicleType', allowRoles(CUSTOMER, ADMIN), addonController.getAddonsByVehicleType);

/**
 * 🔒 ADMIN ONLY (WRITE)
 */

// @desc Create addon
// @route POST /api/addons
// @access Private
router.post('/', allowRoles(ADMIN), addonController.createAddon);

// @desc Update addon
// @route PATCH /api/addons/:id
// @access Private
router.patch('/:id', allowRoles(ADMIN), addonController.updateAddon);

// @desc Delete addon
// @route DELETE /api/addons/:id
// @access Private
router.delete('/:id', allowRoles(ADMIN), addonController.deleteAddon);

module.exports = router;
