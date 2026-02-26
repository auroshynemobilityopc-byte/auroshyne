const Joi = require('joi');

exports.createDiscountDTO = Joi.object({
    code: Joi.string().trim().uppercase().required(),
    type: Joi.string().valid('percentage', 'fixed').required(),
    value: Joi.number().min(0).required(),
    minOrderValue: Joi.number().min(0).default(0),
    maxDiscount: Joi.number().min(0).optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().greater(Joi.ref('startDate')).optional(),
    usageLimit: Joi.number().integer().min(0).default(0),
    isActive: Joi.boolean().default(true),
    description: Joi.string().trim().optional()
});

exports.updateDiscountDTO = Joi.object({
    type: Joi.string().valid('percentage', 'fixed').optional(),
    value: Joi.number().min(0).optional(),
    minOrderValue: Joi.number().min(0).optional(),
    maxDiscount: Joi.number().min(0).optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().greater(Joi.ref('startDate')).optional(),
    usageLimit: Joi.number().integer().min(0).optional(),
    isActive: Joi.boolean().optional(),
    description: Joi.string().trim().optional()
}).min(1);

exports.paginationDTO = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    isActive: Joi.boolean().optional(),
});
