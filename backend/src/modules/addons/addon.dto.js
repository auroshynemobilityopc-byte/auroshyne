const Joi = require('joi');

exports.createAddonDTO = Joi.object({
    name: Joi.string().trim().required(),
    price: Joi.number().min(0).required(),
    vehicleType: Joi.string().valid('2W', '4W', 'CAB').required(),
});

exports.updateAddonDTO = Joi.object({
    name: Joi.string().trim(),
    price: Joi.number().min(0),
    isActive: Joi.boolean(),
});

exports.paginationDTO = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    isActive: Joi.boolean().optional(),
});
