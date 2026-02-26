const asyncHandler = require('../../common/utils/asyncHandler');
const invoiceService = require('./invoice.service');


exports.generateInvoice = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    const data = await invoiceService.generateInvoice(bookingId);

    res.status(200).json({
        success: true,
        message: 'Invoice generated',
        data,
    });
});

