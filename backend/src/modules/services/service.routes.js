const router = require('express').Router();

const serviceController = require('./service.controller');
const { protect } = require('../../common/middleware/auth.middleware');
const { allowRoles } = require('../../common/middleware/role.middleware');
const { ADMIN, CUSTOMER } = require('../../common/constants/roles');


router.get('/', protect, allowRoles(CUSTOMER, ADMIN), serviceController.getServices);

router.get('/vehicleType/:vehicleType', protect, allowRoles(CUSTOMER, ADMIN), serviceController.getServiceByVehicleType);

router.get('/:id', protect, allowRoles(CUSTOMER, ADMIN), serviceController.getServiceById);

router.post('/', protect, allowRoles(ADMIN), serviceController.createService);

router.patch('/:id', protect, allowRoles(ADMIN), serviceController.updateService);

router.delete('/:id', protect, allowRoles(ADMIN), serviceController.deleteService);

module.exports = router;
