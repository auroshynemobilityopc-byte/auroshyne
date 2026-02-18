const router = require('express').Router();

const userController = require('./user.controller');
const { protect } = require('../../common/middleware/auth.middleware');
const { allowRoles } = require('../../common/middleware/role.middleware');
const { ADMIN, CUSTOMER } = require('../../common/constants/roles');

router.use(protect);

router.get('/me', allowRoles(ADMIN, CUSTOMER), userController.getMyProfile);

router.patch('/me', allowRoles(ADMIN, CUSTOMER), userController.updateMyProfile);

router.post('/', allowRoles(ADMIN), userController.createUser);

router.get('/', allowRoles(ADMIN), userController.getUsers);

router.get('/:id', allowRoles(ADMIN), userController.getUserById);

router.patch('/:id', allowRoles(ADMIN), userController.updateUser);

router.delete('/:id', allowRoles(ADMIN), userController.deleteUser);

module.exports = router;
