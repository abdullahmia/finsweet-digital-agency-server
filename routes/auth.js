const { register, login, forgotPasswordEmailSend, resetPassword, changePassword, getUser, updateUser } = require('../controllers/authController');
const { isLoggedIn } = require('../middlewares/auth');

const router = require('express').Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPasswordEmailSend);
router.post('/reset-password/:userId/:token', resetPassword);
router.post('/change-password', isLoggedIn, changePassword);
router.get('/user/:userId', isLoggedIn, getUser);
router.patch('/user/:userId', isLoggedIn, updateUser);

module.exports = router;