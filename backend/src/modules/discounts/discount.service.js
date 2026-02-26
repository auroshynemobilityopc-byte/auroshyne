const Discount = require('./discount.model');
const { AppError } = require('../../common/utils/appError');

exports.createDiscount = async (payload) => {
    const exists = await Discount.findOne({ code: payload.code });
    if (exists) throw new AppError('Discount code already exists', 400);

    return Discount.create(payload);
};

exports.getDiscounts = async ({ page, limit, isActive }, role) => {
    const skip = (page - 1) * limit;

    const filter = {};
    if (role === 'ADMIN' && isActive !== undefined) {
        filter.isActive = Boolean(isActive);
    } else if (role === 'CUSTOMER') {
        filter.isActive = true;
    }

    const [data, total] = await Promise.all([
        Discount.find(filter).skip(skip).limit(limit).lean(),
        Discount.countDocuments(filter),
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

exports.getDiscountById = async (id) => {
    const discount = await Discount.findById(id).lean();
    if (!discount) throw new AppError('Discount not found', 404);
    return discount;
};

exports.updateDiscount = async (id, payload) => {
    const discount = await Discount.findByIdAndUpdate(id, payload, {
        returnDocument: 'after'
    }).lean();

    if (!discount) throw new AppError('Discount not found', 404);
    return discount;
};

exports.deleteDiscount = async (id) => {
    const discount = await Discount.findByIdAndDelete(id).lean();
    if (!discount) throw new AppError('Discount not found', 404);
    return true;
};

exports.validateDiscountCode = async (code, orderValue) => {
    const discount = await Discount.findOne({ code, isActive: true });

    if (!discount) throw new AppError('Invalid or inactive discount code', 400);

    const now = new Date();
    if (discount.startDate && new Date(discount.startDate) > now) {
        throw new AppError('Discount code is not yet active', 400);
    }

    if (discount.endDate && new Date(discount.endDate) < now) {
        throw new AppError('Discount code has expired', 400);
    }

    if (discount.usageLimit > 0 && discount.usedCount >= discount.usageLimit) {
        throw new AppError('Discount code usage limit exceeded', 400);
    }

    if (discount.minOrderValue > 0 && orderValue < discount.minOrderValue) {
        throw new AppError(`Minimum order value of Rs.${discount.minOrderValue} required for this discount`, 400);
    }

    return discount;
};
