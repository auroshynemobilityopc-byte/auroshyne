const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
    {
        type: { type: String, enum: ['2W', '4W', 'CAB'], required: true },
        number: { type: String, required: true },
        model: { type: String },
        cc: { type: String, default: "" },
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: true,
        },
        addons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Addon' }],
        price: { type: Number, required: true },
    },
    { _id: false }
);

const bookingSchema = new mongoose.Schema(
    {
        bookingId: { type: String, unique: true, index: true },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        category: {
            type: String,
            enum: ['private', 'commercial']
        },

        customer: {
            name: { type: String, required: true },
            mobile: {
                type: String,
                required: true,
                match: /^[6-9]\d{9}$/,
            },
            address: { type: String, required: true },
            apartmentName: { type: String },
        },

        vehicles: [vehicleSchema],

        slot: {
            type: String,
            enum: ['MORNING', 'AFTERNOON', 'EVENING'],
            required: true,
            index: true,
        },

        date: { type: String, required: true, index: true },

        status: {
            type: String,
            enum: [
                'PENDING',
                'ASSIGNED',
                'IN_PROGRESS',
                'COMPLETED',
                'CANCELLED',
            ],
            default: 'PENDING',
            index: true,
        },

        technicianId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Technician',
            default: null,
        },

        payment: {
            method: { type: String, default: null },
            status: {
                type: String,
                enum: [
                    'PAID',
                    'UNPAID',
                    'FAILED',
                    'REFUND_INITIATED',
                    'REFUNDED',
                ],
                default: 'UNPAID',
                index: true,
            },
            transactionId: { type: String },
        },

        totalAmount: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        isBulk: { type: Boolean, default: false },
    },
    { timestamps: true }
);

bookingSchema.index({
    date: 1,
    slot: 1,
    'vehicles.number': 1,
});

bookingSchema.pre('save', function () {
    if (!this.bookingId) {
        this.bookingId = `BW${Date.now()}`;
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
