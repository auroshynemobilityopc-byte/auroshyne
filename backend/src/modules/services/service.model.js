const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, index: true },
        vehicleType: {
            type: String,
            enum: ['2W', '4W', 'CAB'],
            required: true,
            index: true,
        },
        price: { type: Number, required: true, min: 0 },
        description: { type: String, trim: true },
        isActive: { type: Boolean, default: true, index: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
