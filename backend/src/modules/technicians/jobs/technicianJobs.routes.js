const router = require('express').Router();

const technicianJobsController = require('./technicianJobs.controller');
const { protect } = require('../../../common/middleware/auth.middleware');
const { allowRoles } = require('../../../common/middleware/role.middleware');
const { ADMIN, TECHNICIAN } = require('../../../common/constants/roles');

/**
 * 🔐 LOGIN REQUIRED
 */
router.use(protect);

/**
 * 🧰 VIEW JOBS
 * Technician → own
 * Admin → all assigned
 */
router.get(
    '/',
    allowRoles(ADMIN, TECHNICIAN),
    technicianJobsController.getMyJobs
);

/**
 * 🔄 UPDATE STATUS
 * Technician → own
 * Admin → any
 */
router.patch(
    '/status',
    allowRoles(ADMIN, TECHNICIAN),
    technicianJobsController.updateJobStatus
);

module.exports = router;
