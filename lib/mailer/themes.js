const mailgen = require('mailgen');
const dotenv = require('dotenv');
dotenv.config();

// configure mailgen by setting a theme
let MailGenarator = new mailgen({
    theme: 'default',
    product: {
        name: "Smart Agency",
        link: process.env.CLIENT_URL
    }
})

// Welcom email genarator
const WelcomeEmail = (response) => {
    let email = {
        body: {
            name: response.name,
            intro: 'Welcome to Smart Agency! We\'re very excited to have you on board.',
            action: {
                instructions: 'To get started with Smart Agency, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'My Account',
                    link: `${process.env.CLIENT_URL}/account`
                }
            },
        }
    };
    let mail = MailGenarator.generate(email);
    return mail;
}


// password reset email genarator
const ResetPasswordEmail = ({ name, _id, token }) => {
    let email = {
        body: {
            name: name,
            intro: 'You have received this email because a password reset request for your account was received.',
            action: {
                instructions: 'Click the button below to reset your password:',
                button: {
                    color: '#DC4D2F',
                    text: 'Reset your password',
                    link: `${process.env.CLIENT_URL}/reset-password/${_id}/${token}`
                }
            },
            outro: 'If you did not request a password reset, no further action is required on your part.'
        }
    };
    let mail = MailGenarator.generate(email);
    return mail;
}


// service purchase email genarator
const ServicePurchaseEmail = ({ userName, name, price, order }) => {
    // service details with price email
    let email = {
        body: {
            name: userName,
            intro: 'You have received this email because you have purchased a service.',
            table: {
                data: [
                    {
                        service: name,
                        price: price
                    }
                ],
                columns: {
                    // Optionally, customize the column widths
                    customWidth: {
                        service: '20%',
                        price: '20%'
                    },
                    // Optionally, change column text alignment
                    customAlignment: {
                        price: 'right'
                    }
                }
            },
            action: {
                instructions: 'To see your service details, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Order Details',
                    link: `${process.env.CLIENT_URL}/account/history/${order}`,
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };
    let mail = MailGenarator.generate(email);
    return mail;
}


module.exports = { WelcomeEmail, ResetPasswordEmail, ServicePurchaseEmail };