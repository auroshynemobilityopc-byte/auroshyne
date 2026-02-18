const router = require('express').Router();

const technicianController = require('./technician.controller');
const { protect } = require('../../common/middleware/auth.middleware');
const { allowRoles } = require('../../common/middleware/role.middleware');
const { ADMIN } = require('../../common/constants/roles');

router.use(protect);
router.use(allowRoles(ADMIN));

router.post('/', technicianController.createTechnician);

router.get('/', technicianController.getTechnicians);

router.get('/:id', technicianController.getTechnicianById);

router.patch('/:id', technicianController.updateTechnician);

router.delete('/:id', technicianController.deleteTechnician);

module.exports = router;
