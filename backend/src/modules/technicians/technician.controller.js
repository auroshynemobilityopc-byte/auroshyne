const asyncHandler = require('../../common/utils/asyncHandler');
const technicianService = require('./technician.service');
const {
    createTechnicianDTO,
    updateTechnicianDTO,
    paginationDTO,
} = require('./technician.dto');
const { AppError } = require('../../common/utils/appError');

exports.createTechnician = asyncHandler(async (req, res) => {
    const { error, value } = createTechnicianDTO.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const data = await technicianService.createTechnician(value);

    res.status(201).json({
        success: true,
        message: 'Technician created',
        data,
    });
});

exports.getTechnicians = asyncHandler(async (req, res) => {
    const { error, value } = paginationDTO.validate(req.query);
    if (error) throw new AppError(error.details[0].message, 400);

    const data = await technicianService.getTechnicians(value, req.user.role);

    res.status(200).json({
        success: true,
        message: 'Technicians fetched',
        ...data,
    });
});

exports.getTechnicianById = asyncHandler(async (req, res) => {
    const data = await technicianService.getTechnicianById(req.params.id);

    res.status(200).json({ success: true, data });
});

exports.updateTechnician = asyncHandler(async (req, res) => {
    const { error, value } = updateTechnicianDTO.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const data = await technicianService.updateTechnician(
        req.params.id,
        value
    );

    res.status(200).json({
        success: true,
        message: 'Technician updated',
        data,
    });
});

exports.deleteTechnician = asyncHandler(async (req, res) => {
    await technicianService.deleteTechnician(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Technician deleted',
    });
});
