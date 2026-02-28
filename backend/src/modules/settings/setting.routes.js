const router = require('express').Router();

const settingController = require('./setting.controller');
const { protect } = require('../../common/middleware/auth.middleware');
const { allowRoles } = require('../../common/middleware/role.middleware');
const { ADMIN } = require('../../common/constants/roles');

router.get('/', settingController.getSettings);

router.patch('/', protect, allowRoles(ADMIN), settingController.updateSettings);

module.exports = router;
