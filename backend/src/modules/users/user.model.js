const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { ADMIN, TECHNICIAN, CUSTOMER } = require('../../common/constants/roles');

const savedAddressSchema = new mongoose.Schema({
    label: { type: String, required: true, trim: true },  // e.g. "Home", "Office"
    address: { type: String, required: true, trim: true },
    apartmentName: { type: String, trim: true, default: '' },
    mobile: { type: String, trim: true, default: '' },
}, { _id: true, timestamps: false });

const savedVehicleSchema = new mongoose.Schema({
    label: { type: String, trim: true, default: '' },            // e.g. "My Bike"
    number: { type: String, required: true, trim: true, uppercase: true },
    type: { type: String, enum: ['2W', '4W', 'CAB'], required: true },
    model: { type: String, trim: true, default: '' },
}, { _id: true, timestamps: false });

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        mobile: {
            type: String,
            required: true,
            match: /^[6-9]\d{9}$/,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },
        role: {
            type: String,
            enum: [ADMIN, TECHNICIAN, CUSTOMER],
            default: TECHNICIAN,
            index: true,
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
        refreshToken: {
            type: String,
            default: null,
        },
        passwordChangedAt: {
            type: Date,
            default: null,
        },
        savedAddresses: { type: [savedAddressSchema], default: [] },
        savedVehicles: { type: [savedVehicleSchema], default: [] },
    },
    { timestamps: true }
);


userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 10);

    this.passwordChangedAt = Date.now();
});

module.exports = mongoose.model('User', userSchema);
