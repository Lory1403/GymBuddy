const express = require('express');
const router = express.Router();
const Appuntamento = require('./models/appuntamento');
const Calendario = require('./models/calendario');
const Utente = require('./models/utente');
const Palesta = require('./models/palestra');


router.get('', (req, res) => {
    Appuntamento.find({}).then(appuntamenti => {
        res.send(appuntamenti);
    });
});


// get by userid
router.get('/byuser', async (req, res) => {

    let utente = await Utente.findById(req.body.idUtente);
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
});

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
});

//in req ci sono id di tutti i calendari coinvolti incluso quello di chi sta creando l'appuntamento
router.post('', async (req, res) => {

    if (!req.body.title) {
        res.status(400);
        res.json({
            success: false,
            message: "titolo mancante",
        });
        return;
    }

    if (!req.body.date) {
        res.status(400);
        res.json({
            success: false,
            message: "data mancante",
        });
        return;
    }

    if (!req.body.descrizione) {
        res.status(400);
        res.json({
            success: false,
            message: "descrizione mancante",
        });
        return;
    }

    if (req.body.involved.length === 0) {
        res.status(400);
        res.json({
            success: false,
            message: "utenti coinvolti mancanti",
        });
        return;
    }

    const appuntamento = new Appuntamento({
        titolo: req.body.title,
        data: req.body.date,
        descrizione: req.body.descrizione,
        involves: req.body.involved
    });

    appuntamento.save();

    appuntamento.involves.map(async (involved) => {
        let utente = await Utente.findById(involved);
        let calendarioUtente = await Calendario.findById(utente.idCalendario);
        calendarioUtente.appuntamenti.push(appuntamento._id);
        calendarioUtente.save();
    });

    console.log('Appointment saved successfully!');

    res.location("/api/v1/appuntamenti/" + appuntamento._id).status(201).send();

});

router.post('corso', async (req, res) => {
    let utente = Utente.findOne(req.loggedUser.email);

    if (utente.role === "amm") {
        let palestra = Palestra.findById(utente.idPalestra);

        // inserire lappuntamento nel calendario giusto

        let calendario = palestra.calendariCorsi.map(async (idCalendario) => {
            let temp = Calendari.findById(idCalendario)
            if (temp.nome === req.body.courseName) {
                return temp;
            }
        });

        const appuntamento = new Appuntamento({
            isCourse: true,
            titolo: req.body.title,
            data: req.body.date,
            descrizione: req.body.descrizione,
            involves: req.body.involved
        });

        calendario.appuntamenti.push(appuntamento._id);

        appuntamento.involves.map(async (involved) => {
            let utente = await Utente.findById(involved);
            let calendarioUtente = await Calendario.findById(utente.idCalendario);
            calendarioUtente.appuntamenti.push(appuntamento._id);
            calendarioUtente.save();
        });

        calendario.save();
        palestra.save();
        appuntamento.save();
    }
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
    });

    appuntamento.deleteOne();

    console.log('Appintment removed successfully!');

    res.status(204).send();
    res.status(204).json({
        success: true,
        message: "Appuntamento rimosso con successo"
    });
});

module.exports = router;