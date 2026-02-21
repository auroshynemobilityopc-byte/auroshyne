const Technician = require('./technician.model');
const { AppError } = require('../../common/utils/appError');

exports.createTechnician = async (payload) => {
    const exists = await Technician.findOne({ mobile: payload.mobile });
    if (exists) throw new AppError('Technician already exists', 400);

    return Technician.create(payload);
};

exports.getTechnicians = async ({ page, limit, isActive }, role) => {
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (role === 'ADMIN' && isActive !== undefined) {
        filter.isActive = isActive;
    } else if (role === 'CUSTOMER') {
        filter.isActive = true;
    }

    const [data, total] = await Promise.all([
        Technician.find(filter).skip(skip).limit(limit).lean(),
        Technician.countDocuments(filter),
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

exports.getTechnicianById = async (id) => {
    const tech = await Technician.findById(id).lean();
    if (!tech) throw new AppError('Technician not found', 404);
    return tech;
};

exports.updateTechnician = async (id, payload) => {
    const tech = await Technician.findByIdAndUpdate(id, payload, {
        returnDocument: 'after'
    }).lean();

    if (!tech) throw new AppError('Technician not found', 404);
    return tech;
};

exports.deleteTechnician = async (id) => {
    const tech = await Technician.findByIdAndDelete(id);
    if (!tech) throw new AppError('Technician not found', 404);
    return true;
};
