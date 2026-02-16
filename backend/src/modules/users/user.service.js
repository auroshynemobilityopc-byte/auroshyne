const User = require('./user.model');
const { AppError } = require('../../common/utils/appError');

exports.createUser = async (payload) => {
    const exists = await User.findOne({
        $or: [{ email: payload.email }, { mobile: payload.mobile }],
    });

    if (exists) throw new AppError('User already exists', 400);

    const user = await User.create(payload);
    return user;
};

exports.getUsers = async ({ page, limit }) => {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        User.find().select('-password').skip(skip).limit(limit).lean(),
        User.countDocuments(),
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

exports.getUserById = async (id) => {
    const user = await User.findById(id).select('-password').lean();
    if (!user) throw new AppError('User not found', 404);
    return user;
};

exports.updateUser = async (id, payload) => {
    const user = await User.findByIdAndUpdate(id, payload, {
        returnDocument: 'after'
    })
        .select('-password')
        .lean();

    if (!user) throw new AppError('User not found', 404);
    return user;
};

exports.deleteUser = async (id) => {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new AppError('User not found', 404);
    return true;
};
