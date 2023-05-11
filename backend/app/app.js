var env = require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
//const user = require('./models/utente');
//const passport = require('passport');
var passport = require('./google/googleAuth');
const BearerStrategy = require('passport-http-bearer');
var User = require('./models/utente');

const tokenChecker = require('./tokenChecker.js');

// api nostre protette
app.use('/api/v1/palestre', tokenChecker);
app.use('/api/v1/abbonamento', tokenChecker);
app.use('/api/v1/calendario', tokenChecker);
app.use('/api/v1/utenti', tokenChecker);



// api nostre che usiamo

//app.use('/api/v1/utenti', utenti);
//app.use('/api/v1/palestre', palestre);
//app.use('/api/v1/abbonamento', abbonamento);
//app.use('/api/v1/calendario', calendario); // dentro a calendario usiamo la api di appuntamento



app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
});

app.use(session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 10000
    }
}));
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new BearerStrategy(
//     function(token, done) {
//       User.findOne({ token: token }, function (err, user) {
//         if (err) { return done(err); }
//         if (!user) { return done(null, false); }
//         return done(null, user, { scope: 'read' });
//       });
//     }
//   ));

app.get('/auth/google',
  passport.authenticate('google', { scope : ['profile', 'email',] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
  }),
  (req, res) => {

    // Salva l'utente in sessione
    req.session.user = req.user;
    res.redirect('/');
  }
);

// Middleware per verificare se l'utente è autenticato
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
};

app.get('/', checkAuthenticated, (req, res) => {
  // Accede ai dati dell'utente dalla sessione
  res.send(`Benvenuto ${req.user.nome}!`);
});

app.get('/login', (req, res) => {
  res.send('Effettua il login con Google: <a href="/auth/google">Login</a>');
});

//autenticazione con Google
app.post('/login', (req,res,next) => {
    passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/api/v1/hello',
        failureFlash: true,
    })(req,res,next);
});

app.post('/logout', (req,res) => {
    req.logout();
    req.session.destroy(function(err) {
        res.redirect('/api/v1/hello');
    });
});

app.get('/google', passport.authenticate('google', { scope : ['profile', 'email',] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect : '/login' }), (req,res) => {
    res.redirect('/profile');
});

app.get('/api/v1/hello', (req,res) => {
    res.json({msg:"Hello world!"})
});


/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});


module.exports = app;