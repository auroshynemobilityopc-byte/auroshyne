const Joi = require('joi');

const vehicleDTO = Joi.object({
    type: Joi.string().valid('2W', '4W', 'CAB').required(),
    number: Joi.string().required(),
    model: Joi.string().allow(''),
    cc: Joi.string().allow(''),
    serviceId: Joi.string().required(),
    addons: Joi.array().items(Joi.string()),
});

exports.createBookingDTO = Joi.object({
    customer: Joi.object({
        name: Joi.string().required(),
        mobile: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
        address: Joi.string().required(),
        apartmentName: Joi.string().allow(''),
    }).required(),

    category: Joi.string().valid('private', 'commercial').allow('', null),
    paymentMode: Joi.string().valid('online', 'cash', 'upi').allow('', null),

    vehicles: Joi.array().items(vehicleDTO).min(1).required(),

    slot: Joi.string()
        .valid('MORNING', 'AFTERNOON', 'EVENING')
        .required(),

    date: Joi.string().required(),
    discountCode: Joi.string().allow('', null).optional(),
});

exports.bulkBookingDTO = Joi.object({
    bookings: Joi.array().items(exports.createBookingDTO).min(1).required(),
});

exports.assignTechnicianDTO = Joi.object({
    bookingId: Joi.string().required(),
    technicianId: Joi.string().required(),
});

exports.updateBookingStatusDTO = Joi.object({
    bookingId: Joi.string().required(),
    status: Joi.string()
        .valid('ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')
        .required(),
});

exports.updatePaymentDTO = Joi.object({
    bookingId: Joi.string().required(),
    method: Joi.string().required(),
    status: Joi.string()
        .valid('PAID', 'FAILED', 'REFUND_INITIATED', 'REFUNDED')
        .required(),
    transactionId: Joi.string().allow(''),
});
