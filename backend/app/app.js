var env = require("dotenv").config();
const express = require("express");
const app = express();
//const user = require('./models/utente');
//const passport = require('passport');
const autenticazione = require('./autenticazione');
var passport = require("./google/googleAuth");
var User = require("./models/utente");
var autenticazioneGoogle = require('./google/autenticazioneGoogle');

const utente = require("./utenti.js");
const tokenChecker = require('./tokenChecker.js');
const abbonamenti = require('./abbonamenti.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(req.method + " " + req.url);
  next();
});

app.use('/api/v1/autenticazioni', autenticazione);
app.use('/api/v1/utenti', utente);
app.use('/auth', autenticazioneGoogle);


// api nostre protette
app.use('/api/v1/palestre', tokenChecker);
app.use('/api/v1/abbonamento', tokenChecker);
app.use('/api/v1/calendario', tokenChecker);
app.use('/api/v1/utenti', tokenChecker);

//api nostre che usiamo
app.use('/api/v1/authentications', authentication);
app.use('/api/v1/utenti', utenti);
app.use('/api/v1/palestre', palestre);
app.use('/api/v1/abbonamenti', abbonamenti);
app.use('/api/v1/calendario', calendario); // dentro a calendario usiamo la api di appuntamento


app.get("/api/v1/hello", (req, res) => {
  res.json({ msg: "Hello world!" });
});

/* Default 404 handler */
app.use((req, res) => {
  res.status(404);
  res.json({ error: "Not found" });
});

module.exports = app;
