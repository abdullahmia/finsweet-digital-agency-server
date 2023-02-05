const router = require('express').Router();

const { initPayment, paymentIpn } = require('../controllers/paymentController');
const { isLoggedIn } = require('../middlewares/auth');


router.route('/:serviceId')
    .get(isLoggedIn, initPayment)


router.route('/ipn')
    .get(paymentIpn)


module.exports = router;