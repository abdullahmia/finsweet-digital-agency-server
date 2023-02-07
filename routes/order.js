const { getUserOrders, getOrderById, getAllOrders, updateOrder } = require('../controllers/orderController');

const router = require('express').Router();
const { isLoggedIn, isAdmin } = require('../middlewares/auth');

router.get('/', isLoggedIn, isAdmin, getAllOrders);
router.get('/user', isLoggedIn, getUserOrders);
router.get('/:id', isLoggedIn, getOrderById);
router.patch('/:id', isLoggedIn, isAdmin, updateOrder);

module.exports = router;