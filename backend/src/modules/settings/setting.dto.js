const Joi = require('joi');

exports.updateSettingDTO = Joi.object({
    slotsCount: Joi.object({
        morning: Joi.number().min(0),
        afternoon: Joi.number().min(0),
        evening: Joi.number().min(0)
    }),
    bookingDays: Joi.number().min(1),
    taxPercentage: Joi.number().min(0),
    videoLink: Joi.string().allow(''),
    homeServices: Joi.array().items(
        Joi.object({
            serviceId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            image: Joi.string().allow(''),
            description: Joi.string().allow('')
        })
    ),
    emailSettings: Joi.object({
        provider: Joi.string().valid('nodemailer', 'resend', 'disabled'),
        fromEmail: Joi.string().email().allow(''),
        fromName: Joi.string().allow(''),
        nodemailer: Joi.object({
            host: Joi.string().allow(''),
            port: Joi.number().allow('', null),
            user: Joi.string().allow(''),
            pass: Joi.string().allow('')
        }),
        resend: Joi.object({
            apiKey: Joi.string().allow('')
        })
    })
});
