const { register, login, forgotPasswordEmailSend, resetPassword, changePassword, getUser, updateUser, getAllUsers } = require('../controllers/authController');
const { isLoggedIn, isAdmin } = require('../middlewares/auth');

const router = require('express').Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPasswordEmailSend);
router.post('/reset-password/:userId/:token', resetPassword);
router.post('/change-password', isLoggedIn, changePassword);
router.get('/user/:userId', isLoggedIn, getUser);
router.patch('/user/:userId', isLoggedIn, updateUser);
router.get('/users', isLoggedIn, isAdmin, getAllUsers);

module.exports = router;