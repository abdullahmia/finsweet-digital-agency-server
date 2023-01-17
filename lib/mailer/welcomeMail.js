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

// response genarator
const AwesomeMailGenarator = (response) => {
    var email = {
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


module.exports = AwesomeMailGenarator;