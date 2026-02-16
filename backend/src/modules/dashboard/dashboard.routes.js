const router = require('express').Router();

const dashboardController = require('./dashboard.controller');
const { protect } = require('../../common/middleware/auth.middleware');
const { allowRoles } = require('../../common/middleware/role.middleware');
const { ADMIN } = require('../../common/constants/roles');

/**
 * 🔒 ADMIN ONLY
 */
router.use(protect);
router.use(allowRoles(ADMIN));

/**
 * @swagger
 * /dashboard/summary:
 *   get:
 *     summary: Get dashboard summary
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard summary fetched successfully
 */
router.get('/summary', dashboardController.getSummary);

module.exports = router;
