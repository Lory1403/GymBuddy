// no visualizzazione a utenti anonimi, personale di sala e personale amministrativo
const express = require('express');
const router = express.Router();
const Palestra = require('./models/palestra');
const Abbonamento = require('./models/abbonamento');
const Utente = require('./models/utente');

router.get('', (req, res) => {
    Palestra.find({}).then(palestre => {
      res.send(palestre);
    });
});

// get palestra dato id
router.get('/:id', async (req, res) => {

    var palestra = await Palestra.findById(req.params.id);

    res.status(200).json({
        self: 'api/v1/palestre/' + palestra.id,
        nome: palestra.nome,
        personale: palestra.personale,
        indirizzo: palestra.indirizzo 
    });
});


// post per creare un utente
router.post('', async (req,res) => {

    var palestra = await new Palestra ({
        nome: req.body.nome,
        indirizzo: req.body.indirizzo,
        //calendariCorsi: req.body.calendariCorsi,
        //abbonamentiDisponibili: req.body.abbonamentiDisponibili
    }).save();

    // bisogna creare un utente amministrativo che gestisce la palestra
    var utente = await new Utente ({
        nome: req.body.nomeAmm,
        cognome: req.body.cognomeAmm,
        email: req.body.emailAmm,
        password: req.body.passwordAmm, // solo se utente registrato tramite form
        role: "amm", // {reg, abb, amm, sala}
        idPalestra: palestra._id
    }).save();

    palestra.personale.push(utente._id);

    palestra.save();

    res.status(201).json({
        success: true,
        message: "Palestra e amministratore creati",
        self: 'api/v1/palestre/' + palestra.id,
        nome: palestra.nome,
        personale: palestra.personale,
        indirizzo: palestra.indirizzo 
    });
});

router.post('/:idPalestra/aggiungiAbbonamento', async (req, res) => {
    
    var palestra = await Palestra.findById(req.params.idPalestra);
    console.log(palestra);

    if(palestra) {
        // aggiungi abbonamento template
        var abbonamento = await new Abbonamento({
            descrizione: req.body.descrizione,
            dataInizio: null,
            dataFine: null,
            // possibile inserimento di durataAbbonamento
            idPalestra: palestra._id
        }).save();

        palestra.abbonamentiDisponibili.push(abbonamento._id);
        palestra.save();

        res.status(201).json({
            success: true,
            message: "Abbonamento template salvato con successo",
            idAbbonamento: abbonamento._id
        });
        return;
    }

    res.status(400).json({
        success: false,
        message: "Palestra non trovata"
    });
});

router.post('/:idPalestra/rimuoviAbbonamento', async (req, res) => {
    
    var palestra = await Palestra.findById(req.params.idPalestra);
    
    var abbonamento = await Abbonamento.findById(req.body.abbonamento);

    if(!palestra) {
        if (!abbonamento) {
            if (palestra.abbonamentiDisponibili.includes(abbonamento._id)) {
                palestra.abbonamentiDisponibili.pull(abbonamento._id);
                palestra.save();
                abbonamento.deleteOne();

                res.status(204).json({
                     success: true,
                    message: "Abbonamento template rimosso con successo"
                });
                return;
            }
            res.status(404).json({
                success: false,
                message: "Abbonamento non presente nella palestra"
            });
            return;
        }
        res.status(404).json({
            success: false,
            message: "Abbonamento non trovato"
        });
        return;
    }
    res.status(404).json({
        success: false,
        message: "Palestra non trovata"
    });
    return;
});

// delete by id
router.delete('/:id', async (req, res) => {

    let palestra = await Palestra.findById(req.params.id);

    if (!palestra) {
        res.status(404).json({
            success: false,
            message: "Palestra non trovata"
        });
        console.log('Palestra not found');
        return;
    }

    palestra.personale.map(async (utente) => {
        utente.deleteOne();
    });

    palestra.deleteOne();
    console.log('Palestra removed sucessfully');
    res.status(204).send();
});

module.exports = router;