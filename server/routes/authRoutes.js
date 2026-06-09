const express = require('express');
const router  = express.Router();
const auth    = require('../controllers/authController');
const verify  = require('../controllers/verificationController');
const protect = require('../middleware/authMiddleware');

router.post('/register',            auth.register);
router.post('/login',               auth.login);
router.get('/me',                   protect, auth.me);

// Email verification
router.post('/send-verification',   verify.sendVerification);
router.post('/verify-code',         verify.verifyCode);
router.post('/resend-code',         verify.resendCode);

module.exports = router;
