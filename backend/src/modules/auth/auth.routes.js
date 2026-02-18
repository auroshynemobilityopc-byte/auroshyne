const router = require('express').Router();
const authController = require('./auth.controller');
const { authLimiter } = require('../../common/middleware/rateLimit.middleware');
const { protect } = require('../../common/middleware/auth.middleware');



router.post('/login', authLimiter, authController.login);

router.post('/register', authLimiter, authController.register);

router.post('/refresh-token', authLimiter, authController.refreshToken);

router.post('/logout', protect, authController.logout);

router.patch('/change-password', protect, authController.changePassword);

module.exports = router;
