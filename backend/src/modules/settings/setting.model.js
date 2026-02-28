const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
    {
        slotsCount: {
            morning: { type: Number, default: 0 },
            afternoon: { type: Number, default: 0 },
            evening: { type: Number, default: 0 }
        },
        bookingDays: { type: Number, default: 7 },
        taxPercentage: { type: Number, default: 0 },
        videoLink: { type: String, default: '' },
        homeServices: [
            {
                serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
                image: { type: String, default: '' },
                description: { type: String, default: '' }
            }
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Setting', settingSchema);
