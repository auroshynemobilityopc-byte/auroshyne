const EmailTemplate = require('./emailTemplate.model');
const { AppError } = require('../../common/utils/appError');

exports.getAllTemplates = async () => {
    return await EmailTemplate.find().sort({ createdAt: -1 });
};

exports.getTemplateById = async (id) => {
    const template = await EmailTemplate.findById(id);
    if (!template) throw new AppError('Template not found', 404);
    return template;
};

exports.createTemplate = async (data) => {
    const existing = await EmailTemplate.findOne({ name: data.name });
    if (existing) throw new AppError('Template with this name already exists', 400);
    return await EmailTemplate.create(data);
};

exports.updateTemplate = async (id, data) => {
    if (data.name) {
        const existing = await EmailTemplate.findOne({ name: data.name, _id: { $ne: id } });
        if (existing) throw new AppError('Template with this name already exists', 400);
    }
    const template = await EmailTemplate.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!template) throw new AppError('Template not found', 404);
    return template;
};

exports.deleteTemplate = async (id) => {
    const template = await EmailTemplate.findByIdAndDelete(id);
    if (!template) throw new AppError('Template not found', 404);
    return template;
};
