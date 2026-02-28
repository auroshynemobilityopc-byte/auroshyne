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
});
