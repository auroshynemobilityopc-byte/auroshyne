const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, uppercase: true, trim: true, unique: true, index: true },
        type: { type: String, required: true, enum: ['percentage', 'fixed'] },
        value: { type: Number, required: true, min: 0 },
        minOrderValue: { type: Number, default: 0, min: 0 },
        maxDiscount: { type: Number, min: 0 },
        startDate: { type: Date },
        endDate: { type: Date },
        usageLimit: { type: Number, default: 0 }, // 0 means unlimited (global)
        usedCount: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true, index: true },
        description: { type: String, trim: true },

        // Per-customer usage tracking
        usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

        // Special usage conditions
        // 'firstBookingOnly' => coupon valid only on customer's first booking
        // 'none' (default)   => no special condition, just once-per-customer
        usageCondition: {
            type: String,
            enum: ['none', 'firstBookingOnly'],
            default: 'none'
        },

        // If true, each customer can only use this code once
        oncePerCustomer: { type: Boolean, default: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Discount', discountSchema);
