var express = require("express");
var router = express.Router;
var passport = require("passport");
var mongoose = require("mongoose");
var User = require("../models/utente");
var Calendario = require("../models/calendario");
var GoogleStrategy = require("passport-google-oauth20").Strategy; //https://www.passportjs.org/reference/
//var User = mongoose.model('User', utente); //require('../models/user');

//var app = express();

//router.post("", async function (req, res) {});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      state: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      // Verifica se l'utente esiste già nel database
      var existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        // Se l'utente esiste già, lo restituisce
        done(null, existingUser);
      } else {
        var calendario = await new Calendario({
          nome: "My calendar",
        }).save();

        // Crea un nuovo utente nel database
        var newUser = await new User({
          googleId: profile.id,
          nome: profile.name.givenName,
          cognome: profile.name.familyName,
          email: profile.emails[0].value,
          password: "GooglePassword",
          idCalendario: calendario._id, // crea calendario
          role: "reg", // {reg, abb, amm, sala}
        }).save();

        session.User = newUser;

        done(null, newUser);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      console.log(user);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});

module.exports = passport;
