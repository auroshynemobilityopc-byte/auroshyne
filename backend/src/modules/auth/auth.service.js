const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../users/user.model');
const { AppError } = require('../../common/utils/appError');
const { CUSTOMER } = require('../../common/constants/roles');
const { generateRefreshToken, generateAccessToken } = require('../../common/utils/token.utils');
const mailService = require('../mail/mail.service');

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

    // Fire auto-email (non-blocking)
    mailService.sendAutoEmail('newRegistration', { userId: user._id });

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

exports.forgotPassword = async (email, origin) => {
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
        // To prevent email enumeration, we could just return true, but the prompt asks to send email.
        // We throw a generic error or specific error based on preferences. Let's just return true to be safe,
        // but if it's an internal tool maybe we want the error. I'll throw error for now.
        throw new AppError('No active user found with this email', 404);
    }

    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    const resetLink = `${origin}/reset-password?token=${resetToken}`;

    mailService.sendAutoEmail('forgotPassword', { 
        userId: user._id, 
        system: { resetLink }
    });

    return true;
};

exports.resetPassword = async (token, newPassword) => {
    const crypto = require('crypto');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) throw new AppError('Token is invalid or has expired', 400);

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.refreshToken = null; // invalidate sessions
    await user.save();

    return true;
};