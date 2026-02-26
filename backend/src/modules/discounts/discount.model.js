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
        usageLimit: { type: Number, default: 0 }, // 0 means unlimited
        usedCount: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true, index: true },
        description: { type: String, trim: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Discount', discountSchema);
