const asyncHandler = require('../../common/utils/asyncHandler');
const notificationService = require('./notification.service');
const { AppError } = require('../../common/utils/appError');

/**
 * GET /notifications
 * Fetch paginated notifications for the logged-in user.
 *
 * Query params:
 *   page    {number}  default 1
 *   limit   {number}  default 20  (capped at 100)
 *   isRead  {boolean} optional filter – "true" | "false"
 */
exports.getMyNotifications = asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));

    let isRead = null;
    if (req.query.isRead === 'true') isRead = true;
    if (req.query.isRead === 'false') isRead = false;

    const result = await notificationService.getUserNotifications(
        req.user._id,
        { page, limit, isRead }
    );

    res.status(200).json({ success: true, ...result });
});

/**
 * GET /notifications/unread-count
 * Returns just the badge counter (lightweight endpoint).
 */
exports.getUnreadCount = asyncHandler(async (req, res) => {
    const count = await notificationService.getUnreadCount(req.user._id);
    res.status(200).json({ success: true, unreadCount: count });
});

/**
 * PATCH /notifications/:id/read
 * Mark a single notification as read.
 */
exports.markAsRead = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await notificationService.markAsRead(id, req.user._id);
    res.status(200).json({ success: true, data });
});

/**
 * PATCH /notifications/read-all
 * Mark every unread notification as read for the logged-in user.
 */
exports.markAllAsRead = asyncHandler(async (req, res) => {
    const result = await notificationService.markAllAsRead(req.user._id);
    res.status(200).json({ success: true, ...result });
});
