const Joi = require('joi');

exports.loginDTO = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});
