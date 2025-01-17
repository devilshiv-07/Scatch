const express = require('express');
const router = express.Router();

router.get("/", function (req, res) {
    res.send("User route is working");
})

module.exports = router;