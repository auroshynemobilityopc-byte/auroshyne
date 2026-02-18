const router = require('express').Router();

const serviceController = require('./service.controller');
const { protect } = require('../../common/middleware/auth.middleware');
const { allowRoles } = require('../../common/middleware/role.middleware');
const { ADMIN, CUSTOMER } = require('../../common/constants/roles');


router.use(protect);

router.get('/', allowRoles(CUSTOMER, ADMIN), serviceController.getServices);

router.get('/vehicleType/:vehicleType', allowRoles(CUSTOMER, ADMIN), serviceController.getServiceByVehicleType);

router.get('/:id', allowRoles(CUSTOMER, ADMIN), serviceController.getServiceById);

router.post('/', allowRoles(ADMIN), serviceController.createService);

router.patch('/:id', allowRoles(ADMIN), serviceController.updateService);

router.delete('/:id', allowRoles(ADMIN), serviceController.deleteService);

module.exports = router;
