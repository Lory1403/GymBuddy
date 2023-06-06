const express = require("express");
const router = express.Router();
const Utente = require("./models/utente"); // get our mongoose model
const tokenCreator = require("./tokenCreator.js");

// ---------------------------------------------------------
// route to authenticate and get a new token
// ---------------------------------------------------------

router.post("", async function (req, res) {
  // find the user
  var user = await Utente.findOne({
    email: req.body.email,
  });

  // user not found
  if (user) {
    res.status(409);
    res.json({
      success: false,
      message: "Registrazione fallita. L'utente esiste già."
    });
    return;
  }

  user = await new Utente({
    nome: req.body.nome,
    cognome: req.body.cognome,
    email: req.body.email,
    password: req.body.password,
    role: "reg"
  }).save();

  let reg = true;

  tokenCreator(user, res, reg);
});

module.exports = router;
