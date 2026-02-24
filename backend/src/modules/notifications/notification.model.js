const mongoose = require('mongoose');

/**
 * @typedef {Object} Notification
 *
 * Production-ready notification model.
 *
 * Design notes
 * ───────────────────────────────────────────────────────────────
 *  • `recipientId`  – The user who should receive this notification
 *                     (always a User._id, not a Technician._id)
 *  • `type`         – Enum-driven so the frontend can render the
 *                     right icon / copy without parsing free-text
 *  • `data`         – Flexible Mixed field to carry any context the
 *                     frontend needs (bookingId, technicianName …)
 *  • `isRead`       – Soft "seen" flag; lets us badge-count unread
 *  • `readAt`       – Timestamp so we can expire/archive old notices
 *  • TTL index      – Documents auto-expire 90 days after creation
 *                     to keep the collection lean in production
 */

const NOTIFICATION_TYPES = {
    TECHNICIAN_ASSIGNED: 'TECHNICIAN_ASSIGNED',
    BOOKING_STATUS_UPDATED: 'BOOKING_STATUS_UPDATED',
    BOOKING_CANCELLED: 'BOOKING_CANCELLED',
    PAYMENT_CONFIRMED: 'PAYMENT_CONFIRMED',
    REFUND_INITIATED: 'REFUND_INITIATED',
    GENERAL: 'GENERAL',
};

const notificationSchema = new mongoose.Schema(
    {
        /** The user who receives this notification */
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        /** Notification category – drives frontend rendering */
        type: {
            type: String,
            enum: Object.values(NOTIFICATION_TYPES),
            required: true,
            index: true,
        },

        /** Short, human-readable title */
        title: {
            type: String,
            required: true,
            maxlength: 120,
        },

        /** Longer body copy shown in the notification panel */
        message: {
            type: String,
            required: true,
            maxlength: 500,
        },

        /**
         * Extra structured data the frontend may need.
         * e.g. { bookingId: "BW…", technicianName: "John" }
         */
        data: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },

        /** Has the user acknowledged / seen this notification? */
        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },

        /** Timestamp of when the user marked it as read */
        readAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true, // createdAt & updatedAt
    }
);

/**
 * Compound index – most common query pattern:
 *   "give me all unread notifications for user X, newest first"
 */
notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

/**
 * TTL index – MongoDB will automatically remove documents
 * 90 days after `createdAt` to keep the collection from growing
 * indefinitely in production.
 */
notificationSchema.index(
    { createdAt: 1 },
    { expireAfterSeconds: 60 * 60 * 24 * 90 } // 90 days
);

module.exports = mongoose.model('Notification', notificationSchema);
module.exports.NOTIFICATION_TYPES = NOTIFICATION_TYPES;
