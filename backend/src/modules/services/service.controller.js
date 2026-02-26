const asyncHandler = require('../../common/utils/asyncHandler');
const serviceService = require('./service.service');
const {
    createServiceDTO,
    updateServiceDTO,
    paginationDTO,
} = require('./service.dto');
const { AppError } = require('../../common/utils/appError');

exports.createService = asyncHandler(async (req, res) => {
    const { error, value } = createServiceDTO.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const data = await serviceService.createService(value);

    res.status(201).json({
        success: true,
        message: 'Service created',
        data,
    });
});

exports.getServices = asyncHandler(async (req, res) => {
    const { error, value } = paginationDTO.validate(req.query);
    if (error) throw new AppError(error.details[0].message, 400);

    const data = await serviceService.getServices(value, req.user?.role || 'CUSTOMER');

    res.status(200).json({
        success: true,
        message: 'Services fetched',
        ...data,
    });
});

exports.getServiceById = asyncHandler(async (req, res) => {
    const data = await serviceService.getServiceById(req.params.id, req.user?.role || 'CUSTOMER');

    res.status(200).json({ success: true, data });
});

exports.updateService = asyncHandler(async (req, res) => {
    const { error, value } = updateServiceDTO.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const data = await serviceService.updateService(req.params.id, value);

    res.status(200).json({
        success: true,
        message: 'Service updated',
        data,
    });
});

exports.deleteService = asyncHandler(async (req, res) => {
    await serviceService.deleteService(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Service deleted',
    });
});

exports.getServiceByVehicleType = asyncHandler(async (req, res) => {
    const data = await serviceService.getServiceByVehicleType(req.params.vehicleType);
    res.status(200).json({ success: true, data });
});
