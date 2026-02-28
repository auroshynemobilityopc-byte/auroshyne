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
    )
});
