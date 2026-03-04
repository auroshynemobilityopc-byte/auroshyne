const express = require('express');
const router = express.Router();
const mailController = require('./mail.controller');
const { protect } = require('../../common/middleware/auth.middleware');

// Protect and maybe restrict to admins if needed. For now, just protect.
router.post('/sendmail', protect, mailController.sendMail);
router.post('/send-parsed', protect, mailController.sendParsedMail);
router.post('/support', protect, mailController.sendSupportMail);

module.exports = router;
