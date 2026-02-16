const rateLimit = require('express-rate-limit');

/**
 * 🌐 GLOBAL LIMITER
 * Applies to all routes
 */
exports.globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1000 requests per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests, please try again later.',
    },
});

/**
 * 🔐 AUTH LIMITER (LOGIN / REGISTER)
 */
exports.authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200, // 20 attempts per 15 min
    message: {
        success: false,
        message: 'Too many login attempts. Try again later.',
    },
});

/**
 * 🧾 BOOKING LIMITER (CUSTOMER)
 */
exports.bookingLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 30, // 30 bookings per 10 min per IP
    message: {
        success: false,
        message: 'Too many booking requests. Please wait.',
    },
});
