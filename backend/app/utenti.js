const express = require('express');
const router = express.Router();
const Utente = require('./models/utente'); 
const Calendario = require('./models/calendario');



router.get('/me', async (req,res) => {

    if(!req.loggedUser) {
        return;
    }

    let utente = await Utente.findOne({email: loggedUser.email});

    res.status(200).json({
        self: '/api/v1/students/' + utente._id,
        email: utente.email
    });
})

// post per creare un utente
router.post('', async (req,res) => {

    let calendario = new Calendario({
        nome: 'My calendar'
    })

    let utente = new Utente({
        nome: req.body.nome,
        cognome: req.body.cognome,
        email: req.body.email,
        idCalendario: calendario._id,
        role: req.body.role,
    });

    calendario.save();
    utente.save();


    console.log('user saved successfully');

    res.location("/api/v1/utenti/" + utente._id).status(201).send();
});


module.exports = router;