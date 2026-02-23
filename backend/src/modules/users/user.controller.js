const asyncHandler = require('../../common/utils/asyncHandler');
const userService = require('./user.service');
const {
    createUserDTO,
    updateUserDTO,
    paginationDTO,
} = require('./user.dto');
const { AppError } = require('../../common/utils/appError');
const User = require('./user.model');

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

/* ─────────────── SAVED ADDRESSES ─────────────── */

exports.getSavedData = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('savedAddresses savedVehicles').lean();
    if (!user) throw new AppError('User not found', 404);
    res.status(200).json({ success: true, data: { savedAddresses: user.savedAddresses, savedVehicles: user.savedVehicles } });
});

exports.addAddress = asyncHandler(async (req, res) => {
    const { label, address, apartmentName, mobile } = req.body;
    if (!label || !address) throw new AppError('label and address are required', 400);
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $push: { savedAddresses: { label, address, apartmentName: apartmentName || '', mobile: mobile || '' } } },
        { new: true, select: 'savedAddresses' }
    );
    res.status(201).json({ success: true, data: user.savedAddresses });
});

exports.deleteAddress = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { savedAddresses: { _id: req.params.id } } },
        { new: true, select: 'savedAddresses' }
    );
    res.status(200).json({ success: true, data: user.savedAddresses });
});

/* ─────────────── SAVED VEHICLES ─────────────── */

exports.addVehicle = asyncHandler(async (req, res) => {
    const { label, number, type, model } = req.body;
    if (!number || !type) throw new AppError('number and type are required', 400);
    if (!['2W', '4W', 'CAB'].includes(type)) throw new AppError('Invalid vehicle type', 400);
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $push: { savedVehicles: { label: label || '', number: number.toUpperCase(), type, model: model || '' } } },
        { new: true, select: 'savedVehicles' }
    );
    res.status(201).json({ success: true, data: user.savedVehicles });
});

exports.deleteVehicle = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { savedVehicles: { _id: req.params.id } } },
        { new: true, select: 'savedVehicles' }
    );
    res.status(200).json({ success: true, data: user.savedVehicles });
});
