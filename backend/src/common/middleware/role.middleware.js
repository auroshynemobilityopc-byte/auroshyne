const { AppError } = require('../utils/appError');

exports.allowRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('Forbidden', 403));
        }
        next();
    };
};
