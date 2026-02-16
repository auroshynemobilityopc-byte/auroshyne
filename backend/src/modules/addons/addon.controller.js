const asyncHandler = require('../../common/utils/asyncHandler');
const addonService = require('./addon.service');
const {
    createAddonDTO,
    updateAddonDTO,
    paginationDTO,
} = require('./addon.dto');
const { AppError } = require('../../common/utils/appError');

exports.createAddon = asyncHandler(async (req, res) => {
    const { error, value } = createAddonDTO.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const data = await addonService.createAddon(value);

    res.status(201).json({
        success: true,
        message: 'Addon created',
        data,
    });
});

exports.getAddons = asyncHandler(async (req, res) => {
    const { error, value } = paginationDTO.validate(req.query);
    if (error) throw new AppError(error.details[0].message, 400);

    const data = await addonService.getAddons(value, req.user.role);

    res.status(200).json({
        success: true,
        message: 'Addons fetched',
        ...data,
    });
});

exports.getAddonById = asyncHandler(async (req, res) => {
    const data = await addonService.getAddonById(req.params.id);

    res.status(200).json({ success: true, data });
});

exports.updateAddon = asyncHandler(async (req, res) => {
    const { error, value } = updateAddonDTO.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const data = await addonService.updateAddon(req.params.id, value);

    res.status(200).json({
        success: true,
        message: 'Addon updated',
        data,
    });
});

exports.deleteAddon = asyncHandler(async (req, res) => {
    await addonService.deleteAddon(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Addon deleted',
    });
});

exports.getAddonsByVehicleType = asyncHandler(async (req, res) => {
    const data = await addonService.getAddonsByVehicleType(req.params.vehicleType);
    res.status(200).json({ success: true, data });
});
