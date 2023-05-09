const express = require('express');
const app = express();


// const authentication = require('./authentication.js');
// const tokenChecker = require('./tokenChecker.js');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// // api nostre protette
// app.use('/api/v1/palestre', tokenChecker);
// app.use('/api/v1/abbonamento', tokenChecker);
// app.use('/api/v1/calendario', tokenChecker);


// // api nostre che usiamo
// app.use('/api/v1/authentications', authentication);
// app.use('/api/v1/palestre', palestre);
// app.use('/api/v1/abbonamento', abbonamento);
// app.use('/api/v1/calendario', calendario); // dentro a calendario usiamo la api di appuntamento



app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
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