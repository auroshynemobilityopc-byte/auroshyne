const asyncHandler = require('../../common/utils/asyncHandler');
const settingService = require('./setting.service');
const { updateSettingDTO } = require('./setting.dto');
const { AppError } = require('../../common/utils/appError');

exports.getSettings = asyncHandler(async (req, res) => {
    const data = await settingService.getSettings();

    res.status(200).json({
        success: true,
        data,
    });
});

exports.updateSettings = asyncHandler(async (req, res) => {
    const { error, value } = updateSettingDTO.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const data = await settingService.updateSettings(value);

    res.status(200).json({
        success: true,
        message: 'Settings updated successfully',
        data,
    });
});
