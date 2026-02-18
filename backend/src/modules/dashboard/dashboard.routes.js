const router = require('express').Router();

const dashboardController = require('./dashboard.controller');
const { protect } = require('../../common/middleware/auth.middleware');
const { allowRoles } = require('../../common/middleware/role.middleware');
const { ADMIN } = require('../../common/constants/roles');


router.use(protect);
router.use(allowRoles(ADMIN));

router.get('/summary', dashboardController.getSummary);

module.exports = router;
