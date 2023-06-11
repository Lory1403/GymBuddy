//var env = require("dotenv").config();             // non usato
const express = require("express");
const app = express();
const cors = require('cors');
const path = require('path');
//const user = require('./models/utente');
//const passport = require('passport');
const autenticazioni = require('./autenticazione');
const registrazioni = require('./registrazione');
var passport = require("./google/googleAuth");    //non usato
//var User = require("./models/utente");            // non usato
var autenticazioneGoogle = require('./google/autenticazioneGoogle');
var appuntamenti = require('./appuntamenti');

const utenti = require("./utenti.js");
const tokenChecker = require('./tokenChecker');
const abbonamenti = require('./abbonamenti');
const palestre = require('./palestre');
const calendari = require('./calendari');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(req.method + " " + req.url);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-access-token');
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  next();
});

app.use('/', express.static('../frontend/dist'));

app.use(cors({
  origin: 'http://localhost:5173'
}));

// api nostre protette
app.use('/api/v1/palestre', tokenChecker);
app.use('/api/v1/abbonamento', tokenChecker);
app.use('/api/v1/calendari', tokenChecker);
app.use('/api/v1/appuntamenti', tokenChecker);
app.use('/api/v1/utenti', tokenChecker);

//api nostre che usiamo
app.use('/api/v1/autenticazioni', autenticazioni);
app.use('/api/v1/registrazioni', registrazioni)
app.use('/api/v1/utenti', utenti);
app.use('/auth', autenticazioneGoogle);
app.use('/api/v1/palestre', palestre);
app.use('/api/v1/abbonamenti', abbonamenti);
app.use('/api/v1/calendari', calendari); // dentro a calendario usiamo la api di appuntamento
app.use('/api/v1/appuntamenti', appuntamenti);


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});


/* Default 404 handler */
app.use((req, res) => {
  res.status(404);
  res.json({ error: "Not found" });
});

module.exports = app;
