const asyncHandler = require('../../common/utils/asyncHandler');
const emailTemplateService = require('./emailTemplate.service');
const { createTemplateDTO, updateTemplateDTO } = require('./emailTemplate.dto');
const { AppError } = require('../../common/utils/appError');

exports.getAllTemplates = asyncHandler(async (req, res) => {
    const data = await emailTemplateService.getAllTemplates();
    res.status(200).json({ success: true, data });
});

exports.getTemplateById = asyncHandler(async (req, res) => {
    const data = await emailTemplateService.getTemplateById(req.params.id);
    res.status(200).json({ success: true, data });
});

exports.createTemplate = asyncHandler(async (req, res) => {
    const { error, value } = createTemplateDTO.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const data = await emailTemplateService.createTemplate(value);
    res.status(201).json({ success: true, data });
});

exports.updateTemplate = asyncHandler(async (req, res) => {
    const { error, value } = updateTemplateDTO.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const data = await emailTemplateService.updateTemplate(req.params.id, value);
    res.status(200).json({ success: true, data });
});

exports.deleteTemplate = asyncHandler(async (req, res) => {
    await emailTemplateService.deleteTemplate(req.params.id);
    res.status(200).json({ success: true, message: 'Template deleted successfully' });
});
