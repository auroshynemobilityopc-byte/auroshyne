const Joi = require('joi');

exports.createTechnicianDTO = Joi.object({
    name: Joi.string().trim().required(),
    mobile: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
});

exports.updateTechnicianDTO = Joi.object({
    name: Joi.string().trim(),
    mobile: Joi.string().pattern(/^[6-9]\d{9}$/),
    isActive: Joi.boolean(),
});

exports.paginationDTO = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    isActive: Joi.boolean(),
});
