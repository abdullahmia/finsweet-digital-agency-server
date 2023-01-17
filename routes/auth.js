const { register, login, forgotPasswordEmailSend, resetPassword, changePassword } = require('../controllers/auth');
const { isLoggedIn } = require('../middlewares/auth');

const router = require('express').Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPasswordEmailSend);
router.post('/reset-password/:userId/:token', resetPassword);
router.post('/change-password', isLoggedIn, changePassword);

module.exports = router;