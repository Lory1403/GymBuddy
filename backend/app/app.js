var env = require("dotenv").config();
const express = require("express");
const app = express();
const session = require("express-session");
//const user = require('./models/utente');
//const passport = require('passport');
const autenticazione = require('./autenticazione.js');
var passport = require("./google/googleAuth");
var User = require("./models/utente");

const tokenChecker = require("./tokenChecker.js");
const utente = require("./utenti.js");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(req.method + " " + req.url);
  next();
});

app.use('/api/v1/autenticazioni', autenticazione);
app.use('/api/v1/utenti', utente)

// // api nostre protette
// app.use("/api/v1/abbonamento", tokenChecker);
// app.use("/api/v1/calendario", tokenChecker);
// app.use("/api/v1/utenti", tokenChecker);

// // api nostre che usiamo

// app.use('/api/v1/utenti', utenti);
// app.use('/api/v1/palestre', palestre);
// app.use('/api/v1/abbonamento', abbonamento);
// app.use('/api/v1/calendario', calendario); // dentro a calendario usiamo la api di appuntamento

app.use(
  session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 10000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
  (req, res) => {
    // Salva l'utente in sessione
    req.session.user = req.user;
    app.use()
    res.redirect("/");
  }
);

// Middleware per verificare se l'utente è autenticato
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  res.redirect("/login");
};

app.get("/", checkAuthenticated, (req, res) => {
  // Accede ai dati dell'utente dalla sessione
  res.send(`Benvenuto ${req.user.nome}!`);
});

app.get("/login", (req, res) => {
  res.send('Effettua il login con Google: <a href="/auth/google">Login</a>');
});

//autenticazione con Google
app.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/api/v1/hello",
    failureFlash: true,
  })(req, res, next);
});

app.post("/logout", (req, res) => {
  req.logout();
  req.session.destroy(function (err) {
    res.redirect("/api/v1/hello");
  });
});

app.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

app.get("/api/v1/hello", (req, res) => {
  res.json({ msg: "Hello world!" });
});

/* Default 404 handler */
app.use((req, res) => {
  res.status(404);
  res.json({ error: "Not found" });
});

module.exports = app;
