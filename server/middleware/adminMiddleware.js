const jwt = require("jsonwebtoken");
const User = require("../models/userModel")

const adminprotect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            let decoded = jwt.verify(token, process.env.JWT_SECRET);
            let user = await User.findById(decoded.id).select('-password')

            if (!user) {
                res.status(401);
                throw new Error("unauthorized access ");
            }
            if (user.isAdmin) {
                req.user = user
                next()
            } else {
                res.status(401);
                throw new Error("unauthorized access: Admin Only  ");
            }
        } catch (error) {
            res.status(401);
            throw new Error("unauthorized access");
        }
    } else {
        res.status(401);
        throw new Error("unauthorized access");
    }
};

module.exports = adminprotect;
