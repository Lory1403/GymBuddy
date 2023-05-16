const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens

const tokenCreator = function (user, res) {
    var payload = {
        email: user.email,
        googleID: user.id
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
        email: user.email,
        googleID: user.id,
        self: "api/v1/" + user._id
    });
}

module.exports = tokenCreator;