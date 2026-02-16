const Joi = require('joi');

exports.createServiceDTO = Joi.object({
    name: Joi.string().trim().required(),
    vehicleType: Joi.string().valid('2W', '4W', 'CAB').required(),
    price: Joi.number().min(0).required(),
    description: Joi.string().allow('').optional(),
});

exports.updateServiceDTO = Joi.object({
    name: Joi.string().trim(),
    vehicleType: Joi.string().valid('2W', '4W', 'CAB'),
    price: Joi.number().min(0),
    description: Joi.string().allow(''),
    isActive: Joi.boolean(),
});

exports.paginationDTO = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    isActive: Joi.boolean().optional(),
});
