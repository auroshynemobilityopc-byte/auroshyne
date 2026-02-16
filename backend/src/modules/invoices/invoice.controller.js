const asyncHandler = require('../../common/utils/asyncHandler');
const invoiceService = require('./invoice.service');
const path = require('path');
const fs = require('fs');

exports.generateInvoice = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    const data = await invoiceService.generateInvoice(bookingId);

    res.status(200).json({
        success: true,
        message: 'Invoice generated',
        data,
    });
});

exports.downloadInvoice = asyncHandler(async (req, res) => {
    const filePath = path.join(
        __dirname,
        '../../../../temp/invoices',
        req.params.fileName
    );

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: 'File not found' });
    }

    res.download(filePath);
});
