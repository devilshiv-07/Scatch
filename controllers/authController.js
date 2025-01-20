const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const {generateToken} = require('../utils/generateToken');

module.exports.registerUser = async function (req, res) {
    try {
        let {email, fullname, password} = req.body;

        let user = await userModel.findOne({email});
        if(user) {
            req.flash("error", "You already have an account, please login.");
            return res.redirect('/');
        }

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, async function(err, hash) {
                if ( err ) return res.send(err.message);
                else {
                    let user = await userModel.create({
                        email,
                        password: hash,
                        fullname
                    })
                    let token = generateToken(user);
                    res.cookie("token", token);
                    return res.redirect('/shop');
                }
            })
        })
    } catch (err) {
        console.error(err.message);
        req.flash("error", "An error occurred. Please try again.");
        return res.redirect('/');
    }
}

module.exports.loginUser = async function (req, res) {
    let {email, password} = req.body;

    let user = await userModel.findOne({email});
    if (!user) {
        req.flash("error", "Email or password incorrect.");
        return res.redirect('/');
    }

    bcrypt.compare(password, user.password , function(err, result){
        if(result){
            let token = generateToken(user);
            res.cookie('token', token);
            res.redirect('/shop')
        }
        else{
            req.flash("error", "Email or password incorrect.");
            return res.redirect('/');
        }
    })
}

module.exports.logout = function (req, res) {
    res.cookie("token", "");
    return res.redirect('/');
};