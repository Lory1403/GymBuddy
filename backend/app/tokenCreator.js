const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens

router.post("", async function (req, u_email, u_id, res) {
    // if user is found and password is right create a token
    var payload = {
        email: u_email,
        id: u_id
        // other data encrypted in the token
    };
    var options = {
        expiresIn: 86400 // expires in 24 hours
    };
    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

    res.status(200);
    res.json({
        success: true,
        message: "Enjoy your token!",
        token: token,
        email: u_email,
        id: u_id,
        self: "api/v1/" + u_id,
    });
});

module.exports = router;