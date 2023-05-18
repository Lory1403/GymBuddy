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

// get palestra dato id
router.get('/:id', async (req, res) => {

    let palestra = await Palestra.findById(req.params.id);

    res.status(200).json({
        self: 'api/v1/palestra/' + palestra.id,
        nome: palestra.nome,
        personale: [String],
    indirizzo: {
        via: palestra.via,
        numeroCivico: palestra.numeroCivico,
        citta: palestra.citta,
        paese: palestra.paese,
        cap: palestra.cap
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

// delete by id


module.exports = router;