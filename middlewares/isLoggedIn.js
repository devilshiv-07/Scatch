const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model');

module.exports = async function (req, res, next) {
    if (!req.cookies.token) {
        req.flash("error, you need to login first");
        return res.redirect("/");
    }

    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        // console.log("decoded : ",decoded);
        let user = await userModel
        .findOne({email: decoded.email})
        .select("-password");
        // console.log("user : ", user);
        req.user = user;
        // console.log("req : ",req);
        next();
    } catch (err) {
        req.flash("error", "Something went wrong");
        res.redirect('/');
    }
}                  