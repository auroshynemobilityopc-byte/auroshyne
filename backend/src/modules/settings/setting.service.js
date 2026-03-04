const Setting = require('./setting.model');
const { AppError } = require('../../common/utils/appError');
const { encrypt } = require('../../common/utils/crypto.util');

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

    // Encrypt sensitive email settings
    if (updateData.emailSettings) {
        // Start from existing email settings to avoid overwriting with undefined
        let emailSettings = setting.emailSettings ? setting.emailSettings.toObject() : {};

        updateData.emailSettings = {
            ...emailSettings,
            ...updateData.emailSettings,
        };

        if (updateData.emailSettings.nodemailer) {
            updateData.emailSettings.nodemailer = {
                ...(emailSettings.nodemailer || {}),
                ...updateData.emailSettings.nodemailer,
            };

            if (updateData.emailSettings.nodemailer.pass && !updateData.emailSettings.nodemailer.pass.includes(':')) {
                updateData.emailSettings.nodemailer.pass = encrypt(updateData.emailSettings.nodemailer.pass);
            }
        }

        if (updateData.emailSettings.resend) {
            updateData.emailSettings.resend = {
                ...(emailSettings.resend || {}),
                ...updateData.emailSettings.resend,
            };

            if (updateData.emailSettings.resend.apiKey && !updateData.emailSettings.resend.apiKey.includes(':')) {
                updateData.emailSettings.resend.apiKey = encrypt(updateData.emailSettings.resend.apiKey);
            }
        }
    }

    const updatedSetting = await Setting.findByIdAndUpdate(setting._id, updateData, {
        new: true,
        runValidators: true,
    }).populate('homeServices.serviceId');

    return updatedSetting;
};
