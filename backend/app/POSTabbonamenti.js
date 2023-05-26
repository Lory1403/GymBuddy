const express = require('express');
const router = express.Router();
const Abbonamento = require('./models/abbonamento');
const Utente = require('./models/utente');
var currentDate = new Date();

//Inserimento abbonamento
router.post('', async (req, res)=>{

    let utente = Utente.findById(req.body.id);

    if(!utente){
        res.status(409).json({
            success: false,
            message: "Utente non trovato"
          });
          return;
    }

    if(!utente.abbonamento || currentDate <= dataInizio || currentDate >= dataFine){
        const abbonamento = await new Abbonamento({
            descrizione: req.body.descrizione,
            dataInizio: req.body.dataInizio,
            dataFine: req.body.dataFine,
            idPalestra: req.body.idPalestra
        }).save();


        utente.abbonamento = abbonamento._id;
        
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

    if (!idPalestra){
        res.status(409).json({
            success: false,
            message: "Palestra non trovata"
        });
        return;
    }

});

module.exports = router;