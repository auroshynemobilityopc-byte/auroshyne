const Setting = require('./setting.model');
const { AppError } = require('../../common/utils/appError');

exports.getSettings = async () => {
    let setting = await Setting.findOne().populate('homeServices.serviceId');
    if (!setting) {
        // Create initial config if it doesn't exist
        setting = await Setting.create({});
    }
    return setting;
};

exports.updateSettings = async (updateData) => {
    let setting = await Setting.findOne();
    if (!setting) {
        setting = await Setting.create({});
    }

    // Merge slotsCount manually to ensure we don't overwrite if they only provide partial updates
    if (updateData.slotsCount) {
        updateData.slotsCount = {
            ...setting.slotsCount.toObject(),
            ...updateData.slotsCount,
        };
    }

    const updatedSetting = await Setting.findByIdAndUpdate(setting._id, updateData, {
        new: true,
        runValidators: true,
    }).populate('homeServices.serviceId');

    return updatedSetting;
};
