const express = require('express');
const app = express();
const user = require('./models/user');
const passport = require('passport');
require('./google/passportLocal')(passport);
require('./google/googleAuth')(passport);



const authentication = require('./authentication.js');
const tokenChecker = require('./tokenChecker.js');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// api nostre protette
app.use('/api/v1/palestre', tokenChecker);
app.use('/api/v1/abbonamento', tokenChecker);
app.use('/api/v1/calendario', tokenChecker);
app.use('api/v1/utenti', tokenChecker);



// api nostre che usiamo

app.use('/authenticate/google');

app.use('/api/v1/authentications', authentication);
app.use('/api/v1/utenti', utenti);
app.use('/api/v1/palestre', palestre);
app.use('/api/v1/abbonamento', abbonamento);
app.use('/api/v1/calendario', calendario); // dentro a calendario usiamo la api di appuntamento



app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
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