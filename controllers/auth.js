module.exports.register = async (req, res) => {
    try {
        const {firstName, lastName, email, password} = req.body;
        return res.send({firstName, lastName, email, password});
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}