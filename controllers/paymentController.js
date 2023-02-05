const SSLCommerz = require("ssl-commerz-node");
const Service = require("../models/Service");
const PaymentSession = SSLCommerz.PaymentSession;
require("dotenv").config();





module.exports.initPayment = async (req, res) => {

    const user = req.user;
    console.log('This is the user: ', user)

    // Get the service id from the url
    const serviceId = req.params.serviceId;

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
        success: "yoursite.com/success", // If payment Succeed
        fail: "yoursite.com/fail", // If payment failed
        cancel: "yoursite.com/cancel", // If user cancel payment
        ipn: "https://smart-agency-server.onrender.com/api/make-payment/ipn", // SSLCommerz will send http post request in this link
    });

    // Set order details
    payment.setOrderInfo({
        total_amount: service.price, // Number field
        currency: "BDT", // Must be three character string
        tran_id: "ref12345667", // Unique Transaction id
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
    // console.log(response);
    return res.status(200).json(response);

}


module.exports.paymentIpn = async (req, res) => {
    console.log(req.body);
}