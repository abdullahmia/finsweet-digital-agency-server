const router = require('express').Router();

const { initPayment } = require('../controllers/paymentController');
const { isLoggedIn } = require('../middlewares/auth');


router.route('/:serviceId')
    .get(isLoggedIn, initPayment)


module.exports = router;