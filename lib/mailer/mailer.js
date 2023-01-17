const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const AwesomeMailGenarator = require('./welcomeMail');
dotenv.config();

let config = {
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    }
}

// create the transproter
let transproter = nodemailer.createTransport(config);


// send mail
const sendMail = async (to, subject, response) => {
    let message = {
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        html: AwesomeMailGenarator(response)
    }

    return await transproter.sendMail(message);
}


module.exports = sendMail;

