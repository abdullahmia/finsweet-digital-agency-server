const router = require('express').Router();

const { initPayment, paymentIpn, paymentSuccess, paymentFail, paymentCancel } = require('../controllers/paymentController');
const { isLoggedIn } = require('../middlewares/auth');


router.route('/:serviceId')
    .get(isLoggedIn, initPayment)


router.route('/ipn')
    .post(paymentIpn)


router.post('/success', paymentSuccess);
router.post('/fail', paymentFail);
router.post('/cancel', paymentCancel);


module.exports = router;