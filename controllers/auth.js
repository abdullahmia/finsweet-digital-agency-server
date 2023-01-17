const { hash } = require("../lib/hash");
const { genarateToken } = require("../lib/jwt");
const User = require("../models/user");




module.exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // check if user is exist
        let user = await User.findOne({email});
        console.log("User: ", user);
        if (user) {
            return res.status(409).json({message: 'User already exist!'});
        }

        // hashing password
        const hashedPassword = await hash(password);
        
        // creatieng a new user
        user = new User({firstName, lastName, email, password: hashedPassword});

        await user.save();

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
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
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