const express = require("express");
const router = express.Router();
const utente = require("./models/utente"); // get our mongoose model
const tokenCreator = require("./tokenCreator.js");

// ---------------------------------------------------------
// route to authenticate and get a new token
// ---------------------------------------------------------

router.post("", async function (req, res) {
  // find the user
  
  var user = await utente.findOne({
    email: req.body.email
  });

  // user not found
  if (!user) {
    res.status(401);
    res.json({
      success: false,
      message: "Authentication failed. User not found.",
    });
    return;
  }

  // check if password matches
  if (user.password != req.body.password) {
    res.status(401);
    res.json({
      success: false,
      message: "Authentication failed. Wrong password.",
    });
    return;
  }

  tokenCreator(user, res);
});

module.exports = router;
