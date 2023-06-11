const express = require('express');
const router = express.Router();

const session = require("express-session");
var passport = require("./googleAuth");
const tokenCreator = require("../tokenCreator");

router.use(
    session({
      secret: process.env.GOOGLE_CLIENT_SECRET,
      resave: false,
      saveUninitialized: false
    })
  );
  
router.use(passport.initialize());
router.use(passport.session());

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    //successRedirect: "/",
    failureRedirect: "/auth/login"
  }),
  (req, res) => {
    // Salva l'utente in sessione
    tokenCreator(req.user, res);
    req.session.user = req.user;
  }
);

// Middleware per verificare se l'utente è autenticato
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  res.redirect("/auth/login");
};

router.get("/", checkAuthenticated, (req, res) => {
  // Accede ai dati dell'utente dalla sessione
  res.send(`Benvenuto ${req.user.nome}!`);
});

router.get("/login", (req, res) => {
  res.send('Effettua il login con Google: <a href="/auth/google">Login</a>');
});

// autenticazione con Google
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/api/v1/hello",
    failureFlash: true,
  })(req, res, next);
});

router.post("/logout", (req, res) => {
  req.logout();
  req.session.destroy(function (err) {
    res.redirect("/api/v1/hello");
  });
});

module.exports = router;