const express = require('express');
const router = express.Router();
const ownerModel = require("../models/owners-model");
require('dotenv').config();

router.get("/", function (req, res) {
    res.send("Owner route is working");
})

if (process.env.NODE_ENV === "development"){
    router.post('/create', async function (req,res) {
        const owners = await ownerModel.find();
        if (owners.length > 0){
            return res
               .status(503)
               .send("You don't have permission to create a new owner");
        }

        let {fullname,email,password} = req.body;

        let createdOwner = await ownerModel.create({
            fullname,
            email,
            password,
        });

        res.status(201).send(createdOwner);
    });
}

module.exports = router;