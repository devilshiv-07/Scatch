const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const router = express.Router();
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');

router.get('/', function (req, res,) {
    const error = req.flash("error");
    res.render('index', { error, loggedin: false });
})

router.get("/shop", isLoggedIn, async function (req, res) {
    let products = await productModel.find();
    let success = req.flash('success');
    res.render("shop", { products, success });
})

router.get("/cart", isLoggedIn, async function (req, res) {
    let user = await userModel
    .findOne({email: req.user.email})
    .populate("cart");
    let totalPrice = 0
    let totalDiscount = 0
    user.cart.forEach(function(product) {
        totalPrice += product.price;
        totalDiscount += product.discount;
    });
    // console.log(user.cart);
    res.render("cart", { user, totalPrice, totalDiscount });
})

router.get("/addtocart/:productid", isLoggedIn, async function (req, res) {
    let user = await userModel.findOne({email: req.user.email});
    // console.log(user);
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success", "Added to cart");
    res.redirect('/shop');
})

module.exports = router