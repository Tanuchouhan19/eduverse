// pseodo Code

// check if token is coming with request object
// check if it is valid token
// if token is valid extract id from token
// use that id to search user in db
// if user found them  run next() to allow authentication
// if anything fails that means unauthorized Access

const jwt = require("jsonwebtoken");
const User = require("../models/userModel")

const protect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            let decoded = jwt.verify(token, process.env.JWT_SECRET);
            let user = await User.findById(decoded.id).select('-password')

            if(!user){
            res.status(401);
            throw new Error("unauthorized access ");
            } 
             
            req.user = user  
            next();
        } catch (error) {
            res.status(401);
            throw new Error("unauthorized access ");
        }
    } else {
        res.status(401);
        throw new Error("unauthorized access ");
    }
};

module.exports = protect;
