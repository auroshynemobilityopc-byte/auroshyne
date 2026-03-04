const Joi = require('joi');

exports.sendMailDto = Joi.object({
    to: Joi.alternatives().try(Joi.string().email(), Joi.array().items(Joi.string().email())).required(),
    subject: Joi.string().required(),
    content: Joi.string().required()
});

exports.sendParsedMailDto = Joi.object({
    to: Joi.alternatives().try(Joi.string().email(), Joi.array().items(Joi.string().email())).optional().allow(null, ''),
    subject: Joi.string().optional().allow(null, ''),
    content: Joi.string().optional().allow(null, ''),
    templateId: Joi.string().optional().allow(null, ''),
    userId: Joi.string().optional().allow(null, '').default(null),
    bookingId: Joi.string().optional().allow(null, ''),
    discountId: Joi.string().optional().allow(null, '')
}).or('content', 'templateId');

exports.sendSupportMailDto = Joi.object({
    subject: Joi.string().required(),
    message: Joi.string().required()
});
