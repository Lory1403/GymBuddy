const express = require('express');
const router = express.Router();
const Appuntamento = require('./models/appuntamento');
const Calendario = require('./models/calendario');
const Utente = require('./models/utente');

//mongoose.model('Appointment', appointmentSchema);



router.get('', (req, res) => {
    Appuntamento.find({}).then(appuntamenti => {
      res.send(appuntamenti);
    });
});


// get by userid
router.get('/:id', async (req, res) => {
    let appuntamenti = await Appuntamento.find().where(req.params.usrid).in(involves).exec();


    appuntamenti = appuntamenti.map( (appuntamento) => {
        return {
            self: '/api/v1/appuntamenti/' + appuntamento.id,
            titolo: String,
            descrizione: String,
            data: Date
        };
    });


    res.status(200).json({
        self: 'api/v1/appuntamenti/' + calendario.idCalendario,
        nome: calendario.nome,
        appuntamenti: calendario.appuntamenti
    })

})

//in req ci sono id del mio calendario, id dei calendari dei coinvolti


router.post('', async (req, res)=>{

    const appuntamento = new Appointment({
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
    });

})

router.delete



