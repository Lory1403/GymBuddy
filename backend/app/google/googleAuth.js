var GoogleStrategy = require('passport-google-oauth20').Strategy; //https://www.passportjs.org/reference/
const user = require('../models/utente');
const clientID = require('../config/googleData').clientId;
const clientSecret = require('../config/googleData').clientSecret;

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID : clientID,
        clientSecret : clientSecret,
        callbackURL : "http://localhost:8080/google/callback"
    }, (accessToken, refreshToken, profile, done) => {
        console.log(profile.emails[0].value);

        // trovare se esiste un utente con questa email
        user.findOne({ email: profile.emails[0].value }).then((data) => {
            if(data) {
                // esiste
                // aggiorna dati
                return done(null, data);
            } else {
                // crea un utente
                user({
                    googleId: profile.id,
                    nome: profile.name.givenName,
                    cognome: profile.name.familyName,
                    email: profile.emails[0].value,
                    idCalendario: null, // crea calendario
                    chat: null,
                    role: null, // {reg, abb, amm, sala}
                    abbonamento: null,
                    idPalestra: null
                }).save(function (err, data) {
                    return done(null, data);
                })
            }
        });
    }

    ));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        user.findById(id, function (err, user) {
            done(err, user);
        });
    });
}