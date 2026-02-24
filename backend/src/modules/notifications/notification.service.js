const Notification = require('./notification.model');
const { NOTIFICATION_TYPES } = require('./notification.model');
const { AppError } = require('../../common/utils/appError');

/**
 * Create a single notification record.
 *
 * @param {Object} params
 * @param {string|ObjectId} params.recipientId  - User._id
 * @param {string}          params.type         - NOTIFICATION_TYPES value
 * @param {string}          params.title        - Short heading
 * @param {string}          params.message      - Body text
 * @param {Object}          [params.data]       - Extra context payload
 * @returns {Promise<Notification>}
 */
exports.createNotification = async ({
    recipientId,
    type,
    title,
    message,
    data = {},
}) => {
    return Notification.create({ recipientId, type, title, message, data });
};

/**
 * Fetch paginated notifications for a user, newest first.
 *
 * @param {string|ObjectId} userId
 * @param {Object}          options
 * @param {number}          [options.page=1]
 * @param {number}          [options.limit=20]
 * @param {boolean|null}    [options.isRead]   - filter by read status; null = all
 * @returns {Promise<{ data, pagination, unreadCount }>}
 */
exports.getUserNotifications = async (
    userId,
    { page = 1, limit = 20, isRead = null } = {}
) => {
    const query = { recipientId: userId };

    if (isRead !== null) {
        query.isRead = isRead;
    }

    const skip = (page - 1) * limit;

    const [data, total, unreadCount] = await Promise.all([
        Notification.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Notification.countDocuments(query),
        Notification.countDocuments({ recipientId: userId, isRead: false }),
    ]);

    return {
        data,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        },
        unreadCount,
    };
};

/**
 * Get only the unread count for a user (badge counter endpoint).
 *
 * @param {string|ObjectId} userId
 * @returns {Promise<number>}
 */
exports.getUnreadCount = async (userId) => {
    return Notification.countDocuments({ recipientId: userId, isRead: false });
};

/**
 * Mark a single notification as read.
 * Validates ownership so users cannot mark someone else's notification.
 *
 * @param {string} notificationId - Notification._id
 * @param {string|ObjectId} userId
 * @returns {Promise<Notification>}
 */
exports.markAsRead = async (notificationId, userId) => {
    const notification = await Notification.findOne({
        _id: notificationId,
        recipientId: userId,
    });

    if (!notification) throw new AppError('Notification not found', 404);

    if (notification.isRead) return notification; // already read – no-op

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    return notification;
};

/**
 * Mark ALL unread notifications for a user as read in one shot.
 *
 * @param {string|ObjectId} userId
 * @returns {Promise<{ modifiedCount: number }>}
 */
exports.markAllAsRead = async (userId) => {
    const result = await Notification.updateMany(
        { recipientId: userId, isRead: false },
        { $set: { isRead: true, readAt: new Date() } }
    );

    return { modifiedCount: result.modifiedCount };
};

/**
 * Helper consumed by other services (e.g. booking.service.js) to fire a
 * "technician assigned" notification without importing the controller layer.
 *
 * @param {Object} params
 * @param {string|ObjectId} params.userId         - Booking owner (customer)
 * @param {string}          params.bookingId      - Human-readable booking ID
 * @param {string}          params.technicianName - Technician's display name
 * @param {string}          params.date           - Booking date string
 * @param {string}          params.slot           - Booking slot (MORNING / …)
 * @returns {Promise<Notification>}
 */
exports.notifyTechnicianAssigned = async ({
    userId,
    bookingId,
    technicianName,
    date,
    slot,
}) => {
    return exports.createNotification({
        recipientId: userId,
        type: NOTIFICATION_TYPES.TECHNICIAN_ASSIGNED,
        title: 'Technician Assigned',
        message: `Your booking ${bookingId} has been assigned to ${technicianName}. They will arrive on ${date} during the ${slot.toLowerCase()} slot.`,
        data: { bookingId, technicianName, date, slot },
    });
};

// Re-export types for convenience
exports.NOTIFICATION_TYPES = NOTIFICATION_TYPES;
