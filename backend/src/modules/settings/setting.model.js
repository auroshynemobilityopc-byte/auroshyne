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
        emailSettings: {
            provider: { type: String, enum: ['nodemailer', 'resend', 'disabled'], default: 'disabled' },
            fromEmail: { type: String, default: '' },
            fromName: { type: String, default: '' },
            nodemailer: {
                host: { type: String, default: '' },
                port: { type: Number, default: 587 },
                user: { type: String, default: '' },
                pass: { type: String, default: '' }
            },
            resend: {
                apiKey: { type: String, default: '' }
            }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Setting', settingSchema);
