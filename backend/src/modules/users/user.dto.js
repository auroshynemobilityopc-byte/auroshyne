const Joi = require('joi');
const { ADMIN, TECHNICIAN, CUSTOMER } = require('../../common/constants/roles');

exports.createUserDTO = Joi.object({
    name: Joi.string().trim().required(),
    mobile: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid(ADMIN, TECHNICIAN, CUSTOMER).required(),
});

exports.updateUserDTO = Joi.object({
    name: Joi.string().trim(),
    mobile: Joi.string().pattern(/^[6-9]\d{9}$/),
    email: Joi.string().email(),
    role: Joi.string().valid(ADMIN, TECHNICIAN, CUSTOMER),
    isActive: Joi.boolean(),
});

exports.paginationDTO = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
});
