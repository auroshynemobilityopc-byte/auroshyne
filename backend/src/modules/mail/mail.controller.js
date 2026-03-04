const asyncHandler = require('../../common/utils/asyncHandler');
const mailService = require('./mail.service');
const { sendMailDto, sendParsedMailDto, sendSupportMailDto } = require('./mail.dto');
const { AppError } = require('../../common/utils/appError');

exports.sendMail = asyncHandler(async (req, res) => {
    const { error, value } = sendMailDto.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    await mailService.sendMail(value);

    res.status(200).json({
        success: true,
        message: 'Mail sent successfully'
    });
});

exports.sendParsedMail = asyncHandler(async (req, res) => {
    const { error, value } = sendParsedMailDto.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    await mailService.sendParsedMail(value);

    res.status(200).json({
        success: true,
        message: 'Templated mail sent successfully'
    });
});

exports.sendSupportMail = asyncHandler(async (req, res) => {
    const { error, value } = sendSupportMailDto.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    // Get from user info from the protected route
    const user = req.user;

    await mailService.sendSupportMail({
        fromEmail: user.email,
        fromName: user.name,
        subject: value.subject,
        message: value.message
    });

    res.status(200).json({
        success: true,
        message: 'Support request sent successfully'
    });
});
