const asyncHandler = require('../../common/utils/asyncHandler');
const userService = require('./user.service');
const {
    createUserDTO,
    updateUserDTO,
    paginationDTO,
} = require('./user.dto');
const { AppError } = require('../../common/utils/appError');

exports.createUser = asyncHandler(async (req, res) => {
    const { error, value } = createUserDTO.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const data = await userService.createUser(value);

    res.status(201).json({
        success: true,
        message: 'User created',
        data,
    });
});

exports.getUsers = asyncHandler(async (req, res) => {
    const { error, value } = paginationDTO.validate(req.query);
    if (error) throw new AppError(error.details[0].message, 400);

    const data = await userService.getUsers(value);

    res.status(200).json({
        success: true,
        message: 'Users fetched',
        ...data,
    });
});

exports.getUserById = asyncHandler(async (req, res) => {
    const data = await userService.getUserById(req.params.id);

    res.status(200).json({
        success: true,
        data,
    });
});

exports.updateUser = asyncHandler(async (req, res) => {
    const { error, value } = updateUserDTO.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const data = await userService.updateUser(req.params.id, value);

    res.status(200).json({
        success: true,
        message: 'User updated',
        data,
    });
});

exports.deleteUser = asyncHandler(async (req, res) => {
    await userService.deleteUser(req.params.id);

    res.status(200).json({
        success: true,
        message: 'User deleted',
    });
});

exports.getMyProfile = asyncHandler(async (req, res) => {
    const data = await userService.getUserById(req.user._id);

    res.status(200).json({
        success: true,
        data,
    });
});

exports.updateMyProfile = asyncHandler(async (req, res) => {
    const { error, value } = updateUserDTO.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const data = await userService.updateUser(req.user._id, value);

    res.status(200).json({
        success: true,
        message: 'Profile updated',
        data,
    });
});