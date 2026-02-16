module.exports = (err, req, res, next) => {
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired',
        });
    }
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Server Error',
    });
};
