const router = require('express').Router();

const serviceController = require('./service.controller');
const { protect, optionalAuth } = require('../../common/middleware/auth.middleware');
const { allowRoles } = require('../../common/middleware/role.middleware');
const { ADMIN, CUSTOMER } = require('../../common/constants/roles');


router.get('/', optionalAuth, serviceController.getServices);

router.get('/vehicleType/:vehicleType', optionalAuth, serviceController.getServiceByVehicleType);

router.get('/:id', optionalAuth, serviceController.getServiceById);

router.post('/', protect, allowRoles(ADMIN), serviceController.createService);

router.patch('/:id', protect, allowRoles(ADMIN), serviceController.updateService);

router.delete('/:id', protect, allowRoles(ADMIN), serviceController.deleteService);

module.exports = router;
