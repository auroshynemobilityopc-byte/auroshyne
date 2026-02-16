const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../users/user.model');
const { AppError } = require('../../common/utils/appError');
const { CUSTOMER } = require('../../common/constants/roles');
const { generateRefreshToken, generateAccessToken } = require('../../common/utils/token.utils');

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

exports.login = async ({ email, password }) => {
    const user = await User.findOne({ email, isActive: true }).select('+password');

    if (!user) throw new AppError('Invalid credentials', 401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError('Invalid credentials', 401);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    return {
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            name: user.name,
            role: user.role,
            email: user.email,
            mobile: user.mobile,
        },
    };
};

exports.register = async (payload) => {
    const exists = await User.findOne({
        $or: [{ email: payload.email }, { mobile: payload.mobile }],
    });

    if (exists) throw new AppError('User already exists', 400);

    const user = await User.create({
        ...payload,
        role: CUSTOMER,
    });

    const token = generateToken(user);

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            role: user.role,
            email: user.email,
            mobile: user.mobile,
        },
    };
};

exports.refreshToken = async (refreshToken) => {
    const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
        user.refreshToken = null;
        await user.save();
        return {
            accessToken: null,
            refreshToken: null,
        }
    }

    // Generate new tokens (token rotation for security)
    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Save new refresh token to database
    user.refreshToken = newRefreshToken;
    await user.save();

    return { accessToken, refreshToken: newRefreshToken };
};

exports.logout = async (userId) => {
    const user = await User.findById(userId);

    if (!user) throw new AppError('User not found', 404);

    user.refreshToken = null;
    await user.save();

    return true;
};

exports.changePassword = async (
    userId,
    currentPassword,
    newPassword
) => {
    const user = await User.findById(userId).select('+password');

    if (!user) throw new AppError('User not found', 404);

    const isMatch = await bcrypt.compare(
        currentPassword,
        user.password
    );

    if (!isMatch) throw new AppError('Current password is incorrect', 400);

    user.password = newPassword;

    /**
     * 🔐 INVALIDATE REFRESH TOKEN
     */
    user.refreshToken = null;

    await user.save();

    return true;
};