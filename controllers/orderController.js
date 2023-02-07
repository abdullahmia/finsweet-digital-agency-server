const Order = require("../models/Order");
const Payment = require('../models/Payment');

// get user orders
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate("user", "-password").populate("service");
        res.status(200).json(orders);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: err.message })
    }
}

// get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate("user", "id name").populate("service").sort('-createdAt');
        res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ msg: err.message })
    }
}

// get order by id
exports.getOrderById = async (req, res) => {
    try {
        const user = req.user;
        const order = await Order.findById(req.params.id).populate("user", "-password").populate("service");
        if (order.user._id.toString() !== user._id.toString() && user.role === 'user') {
            return res.status(403).json({ message: "You are not allowed to see this order" });
        }
        const payment = await Payment.findOne({tran_id: order.transactionId});
        res.status(200).json({order, payment});
    } catch (error) {
        return res.status(500).json({ msg: err.message })
    }
}


// update order by id
module.exports.updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        try {
            const order = await Order.findOneAndUpdate({ _id: orderId }, {...req.body}, { new: true });
            res.status(200).json({ order, message: 'Order has been updated!'});
        } catch (error) {
            return res.status(500).json({ msg: 'Something went wrong' })
        }

    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}