const Joi = require('joi');

exports.registerDTO = Joi.object({
    name: Joi.string().trim().required(),
    mobile: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});
