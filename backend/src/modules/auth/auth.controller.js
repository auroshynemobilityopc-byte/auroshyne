const asyncHandler = require('../../common/utils/asyncHandler');
const authService = require('./auth.service');
const { loginDTO } = require('./login.dto');
const { registerDTO } = require('./register.dto');
const { AppError } = require('../../common/utils/appError');
const { changePasswordDTO, refreshTokenDTO } = require('./auth.dto');

exports.login = asyncHandler(async (req, res) => {
    const { error, value } = loginDTO.validate(req.body);

    if (error) {
        throw new AppError(error.details[0].message, 400);
    }

    const data = await authService.login(value);
    res.status(200).json({
        success: true,
        message: 'Login successful',
        data,
    });
});

exports.register = asyncHandler(async (req, res) => {
    const { error, value } = registerDTO.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const data = await authService.register(value);

    res.status(201).json({
        success: true,
        message: 'Customer registered',
        data,
    });
});

exports.refreshToken = asyncHandler(async (req, res) => {
    const { error, value } = refreshTokenDTO.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const data = await authService.refreshToken(value.refreshToken);
    res.status(200).json({
        success: true,
        data,
    });
});

exports.logout = asyncHandler(async (req, res) => {
    await authService.logout(req.user._id);
    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
});

exports.changePassword = asyncHandler(async (req, res) => {
    const { error, value } = changePasswordDTO.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    await authService.changePassword(
        req.user._id,
        value.currentPassword,
        value.newPassword
    );

    res.status(200).json({
        success: true,
        message: 'Password changed successfully. Please login again.',
    });
});
