const mongoose = require('mongoose');

const assignedSlotSchema = new mongoose.Schema(
    {
        date: { type: String, required: true, index: true }, // YYYY-MM-DD
        slot: {
            type: String,
            enum: ['MORNING', 'AFTERNOON', 'EVENING'],
            required: true,
            index: true,
        },
    },
    { _id: false }
);

const technicianSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        mobile: {
            type: String,
            required: true,
            match: /^[6-9]\d{9}$/,
            index: true,
        },
        isActive: { type: Boolean, default: true, index: true },
        assignedSlots: [assignedSlotSchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Technician', technicianSchema);
