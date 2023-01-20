const jsonwebtoken = require("jsonwebtoken");

module.exports.isLoggedIn = async (req, res, next) => {
    let token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({message: `Access Denied`});
    } else {
        try {
            token = token.split(" ")[1].trim();
            // decode the jwt
            const decoded = await jsonwebtoken.verify(
                token,
                process.env.JWT_SECRET
            );
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(400).send("Invalid Token!");
        }
    }
};


module.exports.isAdmin = async (req, res, next) => {
    let token = req.header("Authorization");
    if (token) {
        try {
            token = token.split(" ")[1].trim();
            const decoedToken = await jsonwebtoken.verify(token, process.env.JWT_SECRET);
            if (decoedToken?.role === 'admin') {
                req.user = decoedToken;
                next();
            } else {
                return res.status(401).json({ message: "Access Denied" });
            }
        } catch (error) {
            return res.status(400).send("Invalid Token!");
        }
    } else {
        return res.status(401).json({ message: "Access Denied" });
    }
}