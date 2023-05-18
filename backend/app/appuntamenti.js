const express = require('express');
const router = express.Router();
const Appuntamento = require('./models/appuntamento');
const Calendario = require('./models/calendario');
const Utente = require('./models/utente');


// NON SO SE FUNZIONA
router.get('', (req, res) => {
    Appuntamento.find({}).then(appuntamenti => {
      res.send(appuntamenti);
    });
});


// get by userid NON SO SE FUNZIONA
router.get('/byuser', async (req, res) => {

    let calendario = await Calendario.findById(utente.idCalendario);

    let appuntamenti = await Promise.all(calendario.appuntamenti.map(async (appuntamentoID) => {
        let appuntamento = await Appuntamento.findById(appuntamentoID);
        console.log(appuntamento);
    
        return {
            self: '/api/v1/appuntamenti/' + appuntamento._id,
            titolo: appuntamento.titolo,
            descrizione: appuntamento.descrizione,
            data: appuntamento.data
        };
    }));

    res.status(200).json(appuntamenti);
})

router.get('/bycalendar', async (req, res) => {

    let calendario = await Calendario.find(req.params.calendarID);


    let appuntamenti = await Promise.all(calendario.appuntamenti.map(async (appuntamentoID) => {
        let appuntamento = await Appuntamento.findById(appuntamentoID);
        console.log(appuntamento);
    
        return {
            self: '/api/v1/appuntamenti/' + appuntamento._id,
            titolo: appuntamento.titolo,
            descrizione: appuntamento.descrizione,
            data: appuntamento.data
        };
    }));

    res.status(200).json(appuntamenti);
})

//in req ci sono id di tutti i calendari coinvolti incluso quello di chi sta creando l'appuntamento
router.post('', async (req, res)=>{

    const appuntamento = new Appuntamento({
        titolo: req.body.title,
        data: req.body.date,
        descrizione: req.body.desc,
        involves: req.body.involved
       });

    appuntamento.save();    

    appuntamento.involves.map(async (involved) => {
        let utente = await Utente.findById(involved);
        let calendarioUtente = await Calendario.findById(utente.idCalendario);
        calendarioUtente.appuntamenti.push(appuntamento._id);
        calendarioUtente.save();
    });

    console.log('Appintment saved successfully!');

    res.location("/api/v1/appuntamenti/" + appuntamento._id).status(201).send();

})


// in req c'è _id dell'appuntamento da togliere
router.delete('/:id', async (req, res) => {
    
    const appuntamento = await Appuntamento.findById(req.body._id);
    console.log(appuntamento);

    appuntamento.involves.map(async (involved) => {
        let utente = await Utente.findById(involved);
        let calendarioUtente = await Calendario.findById(utente.idCalendario);
        calendarioUtente.appuntamenti.pull(appuntamento._id);
        console.log(calendarioUtente);
        calendarioUtente.save();
    })

    appuntamento.deleteOne();

    console.log('Appintment removed successfully!');

    res.status(204).send();
})

module.exports = router;