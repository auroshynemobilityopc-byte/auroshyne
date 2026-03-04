const Joi = require('joi');

exports.createTemplateDTO = Joi.object({
    name: Joi.string().required(),
    subject: Joi.string().required(),
    body: Joi.string().required(),
    placeholders: Joi.array().items(Joi.string()).optional(),
    isActive: Joi.boolean().optional()
});

exports.updateTemplateDTO = Joi.object({
    name: Joi.string().optional(),
    subject: Joi.string().optional(),
    body: Joi.string().optional(),
    placeholders: Joi.array().items(Joi.string()).optional(),
    isActive: Joi.boolean().optional()
});
