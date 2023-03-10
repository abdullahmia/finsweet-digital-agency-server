const { hash } = require("../lib/hash");
const { genarateToken } = require("../lib/jwt");
const sendMail = require("../lib/mailer/mailer");
const { WelcomeEmail, ResetPasswordEmail } = require("../lib/mailer/themes");
const User = require('../models/User');
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



module.exports.changePassword = async (req, res) => {
    try {
        const {oldPassword, newPassword, confirmPassword} = req.body;
        const reqUser = req.user;
        
        // if exist the user
        let user = await User.findOne({_id: reqUser._id});
        let isOldPasswordTrue = await user.isValidatePassword(oldPassword);
        if (isOldPasswordTrue) {
            if (user) {
                if (newPassword === confirmPassword) {
                    const hashedPassword = await hash(newPassword);
                    user.password = hashedPassword;
                    user.save();
                    return res.status(200).json({ message: `Password has been changed!` });
                } else {
                    return res.status(400).json({ message: `Password didn't match!` });
                }
            } else {
                return res.status(404).json({ message: `We couldn't find any user!` });
            }
        } else {
            return res.status(404).json({ message: `Old Password was wrong` });
        }
        

       
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}





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



module.exports.resetPassword = async (req, res) => {
    try {
        const {userId, token} = req.params;
        const { password, confirmPassword } = req.body;

        if (token) {
            let isVerified = verifyToken(token);
            if (isVerified) {
                try {
                    let user = await User.findOne({ _id: userId });
                    if (password === confirmPassword) {
                        const hashedPassword = await hash(password);
                        user.password = hashedPassword;
                        await user.save();
                        return res.status(200).json({ message: `Password has been changed!` });
                    } else {
                        return res.status(400).json({ message: `Password & confirm password didn't match!` });
                    }
                } catch (error) {
                    return res.status(404).json({ message: `We couldn't find any user` }); 
                }
                
            } else {
                return res.status(500).json({message: `Token has been expired!`});
            }
        }

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


module.exports.getUser = async (req, res) => {
    try {
        const {userId} = req.params;
        const user = req.user;
        try {
            const user = await User.findOne({ _id: userId }).select('-password');
            return res.status(200).json(user);
        } catch (err) {
            return res.status(404).json({message: `Couldn't find any user!`})
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


module.exports.updateUser = async (req, res) => {
    try { 
        const userId = req.params.userId;
        try {
            let user = await User.findOne({_id: userId});
            let updatedUser = await User.findOneAndUpdate({_id: userId}, {...req.body}, {new: true}).select('-password');
            return res.status(200).json(updatedUser);
        } catch (err) {
            return res.status(404).json({message: `We couldn't find any user`});
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


// get all user with pagination
module.exports.getAllUsers = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const total = await User.countDocuments();
        const totalPages = Math.ceil(total / limit);

        const users = await User.find({}).skip(skip).limit(limit).select('-password').sort({ createdAt: -1 });
        return res.status(200).json({ users, totalPages });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}