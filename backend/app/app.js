var env = require("dotenv").config();
const express = require("express");
const app = express();
//const user = require('./models/utente');
//const passport = require('passport');
const autenticazioni = require('./autenticazione');
var passport = require("./google/googleAuth");
var User = require("./models/utente");
var autenticazioneGoogle = require('./google/autenticazioneGoogle');

const utenti = require("./utenti.js");
const tokenChecker = require('./tokenChecker');
const abbonamenti = require('./abbonamenti');
//const palestre = require('./palestre');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(req.method + " " + req.url);
  next();
});




// api nostre protette
app.use('/api/v1/palestre', tokenChecker);
app.use('/api/v1/abbonamento', tokenChecker);
app.use('/api/v1/calendario', tokenChecker);
app.use('/api/v1/utenti', tokenChecker);

//api nostre che usiamo
app.use('/api/v1/autenticazioni', autenticazioni);
app.use('/api/v1/utenti', utenti);
app.use('/auth', autenticazioneGoogle);
//app.use('/api/v1/palestre', palestre);
app.use('/api/v1/abbonamenti', abbonamenti);
//app.use('/api/v1/calendario', calendario); // dentro a calendario usiamo la api di appuntamento


app.get("/api/v1/hello", (req, res) => {
  res.json({ msg: "Hello world!" });
});

/* Default 404 handler */
app.use((req, res) => {
  res.status(404);
  res.json({ error: "Not found" });
});

module.exports = app;
