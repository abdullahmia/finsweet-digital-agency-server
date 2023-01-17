const { hash } = require("../lib/hash");
const { genarateToken } = require("../lib/jwt");
const sendMail = require("../lib/mailer/mailer");
const { WelcomeEmail, ResetPasswordEmail } = require("../lib/mailer/themes");
const User = require("../models/user");
const { verifyToken } = require("../utils/utils");


module.exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // check if user is exist
        let user = await User.findOne({email});
        if (user) {
            return res.status(409).json({message: 'User already exist!'});
        }

        // hashing password
        const hashedPassword = await hash(password);
        
        // creatieng a new user
        user = new User({firstName, lastName, email, password: hashedPassword});

        await user.save();

        // send the welcome name with email templates
        await sendMail(email, 'Welcome to Smart Agency', WelcomeEmail({ name: `${user.firstName} ${user.lastName}` }));

        return res.status(200).json({ message: "Register successfull"});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}


module.exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        // if user isn't exist
        let user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({message: "Couldn't find any user with this email!"});
        }


        // validate the password
        const isValidatePassword = await user.isValidatePassword(password);
        if (isValidatePassword) {
            // genarate the jwt token
            const token = await genarateToken({
                payload: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role
                },
                expiresIn: '3d'
            });

            return res.status(200).json({
                user: {
                    _id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role
                },
                token
            })

        } else {
            return res.status(400).json({ message: "Invalid credential" });
        }

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


// Forgot password email send
module.exports.forgotPasswordEmailSend = async (req, res) => {
    try {
        const {email} = req.body;

        if (!email) {
            return res.status(404).json({message: "Field required!"});
        }


        const user = await User.findOne({email});
        if (user) {
            // genarate token for reset password
            const token = genarateToken({payload: {email: user.email}, expiresIn: '10m'});

            // send reset password link via email
            await sendMail(user.email, 'Reset your Smart Agency password', ResetPasswordEmail({ name: `${user.firstName} ${user.lastName}`, _id: user._id ,token }))

            return res.status(200).json({ message: `Password reset link has been sent on your email.`})
        } else {
            return res.status(404).json({message: `We couldn't find any user with this email`});
        }

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


// rest password
module.exports.resetPassword = async (req, res) => {
    try {
        const {userId, token} = req.params;
        const { password, confirmPassword } = req.body;

        if (token) {
            let isVerified = verifyToken(token);
            if (isVerified) {
                let user = await User.findOne({ _id: userId });
                if (user) {
                    if (password === confirmPassword) {
                        const hashedPassword = await hash(password);
                        user.password = hashedPassword;
                        await user.save();
                        return res.status(200).json({message: `Password has been changed!`});
                    } else {
                        return res.status(400).json({message: `Password & confirm password didn't match!`});
                    }
                } else {
                    return res.status(404).json({ message: `We couldn't find any with this email!` });
                }
            } else {
                return res.status(500).json({message: `Token has been expired!`});
            }
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}