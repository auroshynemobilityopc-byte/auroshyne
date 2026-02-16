const mongoose = require('mongoose');

const addonSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, index: true },
        price: { type: Number, required: true, min: 0 },
        vehicleType: {
            type: String,
            enum: ['2W', '4W', 'CAB'],
            required: true,
            index: true,
        },
        isActive: { type: Boolean, default: true, index: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Addon', addonSchema);
