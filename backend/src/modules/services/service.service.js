const Service = require('./service.model');
const { AppError } = require('../../common/utils/appError');

exports.createService = async (payload) => {
    const exists = await Service.findOne({
        name: payload.name,
        vehicleType: payload.vehicleType,
    });

    if (exists) throw new AppError('Service already exists', 400);

    return Service.create(payload);
};

exports.getServices = async ({ page, limit, isActive }, role) => {
    const skip = (page - 1) * limit;

    const filter = {};
    if (role === 'ADMIN' && isActive !== undefined) {
        filter.isActive = Boolean(isActive);
    } else if (role === 'CUSTOMER') {
        filter.isActive = true;
    }
    console.log(filter);

    const [data, total] = await Promise.all([
        Service.find(filter).skip(skip).limit(limit).lean(),
        Service.countDocuments(filter),
    ]);

    return {
        data,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        },
    };
};


exports.getServiceById = async (id, role) => {
    const query = role === 'ADMIN'
        ? { _id: id }
        : { _id: id, isActive: true };

    const service = await Service.findOne(query).lean();

    if (!service) throw new AppError('Service not found', 404);

    return service;
};


exports.updateService = async (id, payload) => {
    const service = await Service.findByIdAndUpdate(id, payload, {
        returnDocument: 'after'
    }).lean();

    if (!service) throw new AppError('Service not found', 404);
    return service;
};

exports.deleteService = async (id) => {
    const service = await Service.findByIdAndDelete(id);
    if (!service) throw new AppError('Service not found', 404);
    return true;
};

exports.getServiceByVehicleType = async (vehicleType) => {
    const services = await Service.find({ vehicleType, isActive: true }).lean();
    return services;
};