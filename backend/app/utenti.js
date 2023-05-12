const express = require('express');
const router = express.Router();
const Utente = require('./models/utente'); 
const Calendario = require('./models/calendario');





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

    idUtente = utente._id;

    console.log('user saved successfully');

    res.location("/api/v1/utenti/" + idUtente).status(201).send();
});


// metodi da aggiungere:
// prenota appuntamento
// disdici appuntamento
// visualizza calendari (solo i nomi)
// visualizza gli appuntamenti di un calendario

module.exports = router;