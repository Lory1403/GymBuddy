const express = require('express');
const router = express.Router();
const Abbonamento = require('./models/abbonamento');
const Utente = require('./models/utente');
const Palestra = require('./models/palestra');
var currentDate = new Date();

//Tutti gli abbonamenti
router.get('', (req, res) => {
    Abbonamento.find({}).then(abbonamenti => {
      res.send(abbonamenti);
    });
});

//Abbonamento 
router.get('/:id', async (req, res) => {
    let abbonamenti = await Abbonamento.findById(req.params.id);

    if (!abbonamenti){
        res.status(409).json({
            success: false,
            message: "Abbonamento non trovato"
        });
        return;
    }

    res.status(200).json({
        self: 'api/v1/abbonamenti/' + abbonamenti._id,
        descrizione: abbonamenti.descrizione,
        dataInizio: abbonamenti.dataInizio,
        dataFine: abbonamenti.dataFine
    });

})

//Inserimento abbonamento
router.post('', async (req, res)=>{

    var utente = await Utente.findById(req.body.id);

    if(!utente){
        res.status(409).json({
            success: false,
            message: "Utente non trovato"
          });
          return;
    }

    let palestra = await Palestra.findById(req.body.idPalestra);

    if (!palestra){
        res.status(409).json({
            success: false,
            message: "Palestra non trovata"
        });
        return;
    }

    let abbonamentoUtente = await Abbonamento.findById(utente.abbonamento);

    if(!abbonamentoUtente || currentDate >= abbonamentoUtente.dataFine){
        const abbonamento = await new Abbonamento({
            descrizione: req.body.descrizione,
            dataInizio: req.body.dataInizio,
            dataFine: req.body.dataFine,
            idPalestra: req.body.idPalestra
        }).save();

        utente.idPalestra = req.body.idPalestra;

        utente.idAbbonamento = abbonamento._id;
        utente.ruolo = "abb";
        
        res.status(200).json({
            self: 'api/v1/abbonamenti/' + abbonamento._id,
            descrizione: abbonamento.descrizione,
            dataInizio: abbonamento.dataInizio,
            dataFine: abbonamento.dataFine,
            success:true,
            message: "Abbonamento inserito"
        });
    }else{
        res.status(409).json({
        success:false,
        message: "L'utente possiede già un abbonamento"
        });
    };

});
module.exports = router;