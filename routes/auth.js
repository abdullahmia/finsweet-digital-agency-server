const { register, login, forgotPasswordEmailSend, resetPassword } = require('../controllers/auth');

const router = require('express').Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPasswordEmailSend);
router.post('/reset-password/:userId/:token', resetPassword);

module.exports = router;