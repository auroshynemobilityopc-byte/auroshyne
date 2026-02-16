const asyncHandler = require('../../common/utils/asyncHandler');
const paymentService = require('./payment.service');
const { updatePaymentDTO } = require('./payment.dto');
const { AppError } = require('../../common/utils/appError');

exports.updatePayment = asyncHandler(async (req, res) => {
    const { error, value } = updatePaymentDTO.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const data = await paymentService.updatePayment(value);

    res.status(200).json({
        success: true,
        message: 'Payment updated',
        data,
    });
});
