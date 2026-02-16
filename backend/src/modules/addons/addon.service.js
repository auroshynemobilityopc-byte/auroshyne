const Addon = require('./addon.model');
const { AppError } = require('../../common/utils/appError');

exports.createAddon = async (payload) => {
    const exists = await Addon.findOne({ name: payload.name });
    if (exists) throw new AppError('Addon already exists', 400);

    return Addon.create(payload);
};

exports.getAddons = async ({ page, limit, isActive }, role) => {
    const skip = (page - 1) * limit;

    const filter = {};
    if (role === 'ADMIN' && isActive !== undefined) {
        filter.isActive = Boolean(isActive);
    } else if (role === 'CUSTOMER') {
        filter.isActive = true;
    }

    const [data, total] = await Promise.all([
        Addon.find(filter).skip(skip).limit(limit).lean(),
        Addon.countDocuments(filter),
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

exports.getAddonById = async (id) => {
    const addon = await Addon.findById(id).lean();
    if (!addon) throw new AppError('Addon not found', 404);
    return addon;
};

exports.updateAddon = async (id, payload) => {
    const addon = await Addon.findByIdAndUpdate(id, payload, {
        returnDocument: 'after'
    }).lean();

    if (!addon) throw new AppError('Addon not found', 404);
    return addon;
};

exports.deleteAddon = async (id) => {
    const addon = await Addon.findByIdAndDelete(id).lean();
    if (!addon) throw new AppError('Addon not found', 404);
    return true;
};

exports.getAddonsByVehicleType = async (vehicleType) => {
    return Addon.find({ vehicleType, isActive: true }).lean();
};
