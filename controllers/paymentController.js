const SSLCommerz = require("ssl-commerz-node");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const Service = require("../models/Service");
const { genarateTransactionId } = require("../utils/utils");
const PaymentSession = SSLCommerz.PaymentSession;
require("dotenv").config();
const Notification = require('../models/Notification');
const User = require('../models/User');


module.exports.initPayment = async (req, res) => {

    const user = req.user;

    // Get the service id from the url
    const serviceId = req.params.serviceId;

    const transactionId = genarateTransactionId();

    // Check if service is exist or not
    const service = await Service.findById(serviceId);

    if (!service) {
        return res.status(404).json({
            success: false,
            message: "Service not found",
        });
    }

    // For live payment set first parameter `false` and for sandbox set it `true`
    const payment = new PaymentSession(
        process.env.SSLCOMMERZ_IS_SANDBOX,
        process.env.SSLCOMMERZ_STORE_ID,
        process.env.SSLCOMMERZ_STORE_PASSWORD
    );

    // Set the urls
    payment.setUrls({
        success: `https://smart-agency-server.onrender.com/api/make-payment/success`, // If payment Succeed
        fail: `https://smart-agency-server.onrender.com/api/make-payment/fail`, // If payment failed
        cancel: `https://smart-agency-server.onrender.com/api/make-payment/cancel`, // If user cancel payment
        ipn: "https://smart-agency-server.onrender.com/api/make-payment/ipn", // SSLCommerz will send http post request in this link
    });

    // Set order details
    payment.setOrderInfo({
        total_amount: service.price, // Number field
        currency: "BDT", // Must be three character string
        tran_id: transactionId, // Unique Transaction id
        emi_option: 0, // 1 or 0
    });

    // Set customer info
    payment.setCusInfo({
        name: user.firstName + " " + user.lastName,
        email: user.email,
        add1: "66/A Midtown",
        add2: "Andarkilla",
        city: "Chittagong",
        state: "Optional",
        postcode: 4000,
        country: "Bangladesh",
        phone: "010000000000",
        fax: "Customer_fax_id",
    });

    // Set shipping info
    payment.setShippingInfo({
        method: "Courier", //Shipping method of the order. Example: YES or NO or Courier
        num_item: 2,
        name: user.firstName + " " + user.lastName,
        add1: "66/A Midtown",
        add2: "Andarkilla",
        city: "Chittagong",
        state: "Optional",
        postcode: 4000,
        country: "Bangladesh",
    });

    // Set Product Profile
    payment.setProductInfo({
        product_name: service.name,
        product_category: "Electronics",
        product_profile: "general",
    });

    let response = await payment.paymentInit();
    let order = new Order({ service: service._id, user: user._id, transactionId: transactionId });
    if (response.status === 'SUCCESS') {
        order.sessionKey = response['sessionkey'];
        await order.save();
    }

    return res.status(200).json(response);
}


module.exports.paymentIpn = async (req, res) => {
    const payment = new Payment(req.body);
    const trans_id = payment['tran_id'];
    if (payment['status'] === 'VALID') {
        const order = await Order.findOneAndUpdate({ transactionId: trans_id }, { status: 'in progress'}, { new: true }).populate('service').populate('user', '-password');
        global.io.emit('newOrder', order);

        console.log(order);

        // get a user a admin user from the database
        const admin = await User.findOne({ role: 'admin' });

        // create a notification for the admin with order created
        const notification = new Notification({
            recipient: admin._id,
            sender: order.user,
            type: 'order',
            link: `/admin/orders/${order._id}`,
            message: `New order created by ${order.user.firstName} ${order.user.lastName}`
        });

        await notification.save();
        global.io.emit('newNotification', notification);

    } else {
        await Order.findOneAndDelete({transactionId: trans_id});
    }

    await payment.save();
    return res.status(200).json({ success: true });
}


module.exports.paymentSuccess = async (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/order-complete?status=success`);
}

module.exports.paymentCancel = async (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/order-complete?status=cancel`);
}

module.exports.paymentFail = async (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/order-complete?status=failed`);
}