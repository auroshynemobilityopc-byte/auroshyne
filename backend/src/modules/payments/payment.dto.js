const Joi = require('joi');

exports.updatePaymentDTO = Joi.object({
    bookingId: Joi.string().required(),
    method: Joi.string().valid('CASH', 'UPI').required(),
    status: Joi.string()
        .valid('PAID', 'FAILED', 'REFUND_INITIATED', 'REFUNDED')
        .required(),
    transactionId: Joi.string().allow('', null),
});
