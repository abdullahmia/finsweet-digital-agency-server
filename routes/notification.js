const { getNotifications } = require('../controllers/notificationContoller');

const router = require('express').Router();

const { isLoggedIn } = require('../middlewares/auth');

router.get('/', isLoggedIn, getNotifications);


module.exports = router;