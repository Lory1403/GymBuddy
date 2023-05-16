// no visualizzazione a utenti anonimi, personale di sala e personale amministrativo
const express = require('express');
const router = express.Router();
const Palestra = require('./models/palestra'); 
const Calendario = require('./models/calendario');

router.get('', (req, res) => {
    Palestra.find({}).then(palestre => {
      res.send(palestre);
    });
});

// post per creare un utente
router.post('', async (req,res) => {

    // bisogna creare un utente amministrativo che gestisce la palestra
    /*



    */

    var palestra = await new Palestra ({
        nome: req.body.nome,
        personale: req.body.personale,
        indirizzo: req.body.indirizzo,
        calendariCorsi: req.body.calendariCorsi,
        abbonamentiDisponibili: req.body.abbonamentiDisponibili
    }).save();

    console.log('Palestra Saved Successfully');

    res.location("/api/v1/palestra/" + palestra._id).status(201).send();
});

module.exports = router;