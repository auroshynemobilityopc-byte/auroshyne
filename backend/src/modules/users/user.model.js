const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { ADMIN, TECHNICIAN, CUSTOMER } = require('../../common/constants/roles');

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
    },
    { timestamps: true }
);


userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 10);

    this.passwordChangedAt = Date.now();
});

module.exports = mongoose.model('User', userSchema);
