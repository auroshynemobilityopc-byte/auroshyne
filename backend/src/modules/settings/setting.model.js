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
        bulkDiscount: {
            twoVehicles: { type: Number, default: 5 },
            threeOrMoreVehicles: { type: Number, default: 10 }
        },
        videoLink: { type: String, default: '' },
        whatsappNumber: { type: String, default: '' },
        showWhatsapp: { type: Boolean, default: true },
        isBookingClosed: { type: Boolean, default: false },
        bookingClosedMessage: { type: String, default: 'Temporary bookings are closed and will be continued soon.' },
        restrictToCity: { type: Boolean, default: false },
        allowedCity: { type: String, default: 'Visakhapatnam' },
        galleryImages: [{ type: String }],
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
        },
        autoEmails: {
            newBooking: {
                enabled:    { type: Boolean, default: false },
                templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailTemplate', default: null }
            },
            newRegistration: {
                enabled:    { type: Boolean, default: false },
                templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailTemplate', default: null }
            },
            bookingCompleted: {
                enabled:    { type: Boolean, default: false },
                templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailTemplate', default: null }
            },
            forgotPassword: {
                enabled:    { type: Boolean, default: false },
                templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailTemplate', default: null }
            }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Setting', settingSchema);
