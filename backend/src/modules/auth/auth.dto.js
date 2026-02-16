const Joi = require('joi');

exports.refreshTokenDTO = Joi.object({
    refreshToken: Joi.string().required(),
});

exports.changePasswordDTO = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
});
