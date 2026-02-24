const router = require('express').Router();

const notificationController = require('./notification.controller');
const { protect } = require('../../common/middleware/auth.middleware');
const { allowRoles } = require('../../common/middleware/role.middleware');
const { CUSTOMER, ADMIN } = require('../../common/constants/roles');

// All notification endpoints require authentication
router.use(protect);

/**
 * GET  /notifications              – list (paginated, filterable by isRead)
 * GET  /notifications/unread-count – badge counter only
 * PATCH /notifications/read-all    – bulk mark-all-read
 * PATCH /notifications/:id/read    – mark single as read
 */

// ─── Read routes ──────────────────────────────────────────────────────────────
router.get(
    '/',
    allowRoles(CUSTOMER, ADMIN),
    notificationController.getMyNotifications
);

router.get(
    '/unread-count',
    allowRoles(CUSTOMER, ADMIN),
    notificationController.getUnreadCount
);

// ─── Mutation routes ──────────────────────────────────────────────────────────

// NOTE: /read-all must be registered BEFORE /:id/read so Express doesn't
//       interpret "read-all" as an :id parameter.
router.patch(
    '/read-all',
    allowRoles(CUSTOMER, ADMIN),
    notificationController.markAllAsRead
);

router.patch(
    '/:id/read',
    allowRoles(CUSTOMER, ADMIN),
    notificationController.markAsRead
);

module.exports = router;
