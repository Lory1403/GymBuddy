const express = require('express');
const router = express.Router();
const Abbonamento = require('./models/abbonamento');
const Utente = require('./models/utente');
var currentDate = new Date();

//Tutti gli abbonamenti
router.get('', (req, res) => {
    Abbonamento.find({}).then(abbonamenti => {
      res.send(abbonamenti);
    });
});

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

module.exports = router;