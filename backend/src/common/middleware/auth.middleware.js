const jwt = require('jsonwebtoken');
const User = require('../../modules/users/user.model');
const { AppError } = require('../utils/appError');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('Not authorized', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) return next(new AppError('User not found', 401));

    /**
     * 🔐 TOKEN INVALIDATION CHECK
     */
    if (
        user.passwordChangedAt &&
        decoded.iat * 1000 < user.passwordChangedAt.getTime()
    ) {
        return next(new AppError('Token expired due to password change', 401));
    }

    req.user = user;
    next();
};
