const express = require('express');
const router = express.Router();
const Appuntamento = require('./models/appuntamento');
const Calendario = require('./models/calendario');
const Utente = require('./models/utente');
const Palestra = require('./models/palestra');

router.get('', (req, res) => {
    Appuntamento.find({}).then(appuntamenti => {
        res.status(200).send(appuntamenti);
    });
});


// get by userid
router.get('/byuser', async (req, res) => {

    if (!req.body.idUtente) {
        res.status(400);
        res.json({
            success: false,
            message: "idUtente mancante",
        });
        return;
    }

    let utente = await Utente.findById(req.body.idUtente);

    if (!utente) {
        res.status(404);
        res.json({
            success: false,
            message: "utente non trovato",
        });
        return;
    }

    let calendario = await Calendario.findById(utente.idCalendario);

    let appuntamenti = await Promise.all(calendario.appuntamenti.map(async (appuntamentoID) => {
        let appuntamento = await Appuntamento.findById(appuntamentoID);
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

    if (!req.body.idCalendario) {
        res.status(400);
        res.json({
            success: false,
            message: "idCalendario mancante",
        });
        return;
    }

    let calendario = await Calendario.findById(req.body.idCalendario);

    if (!calendario) {
        res.status(404);
        res.json({
            success: false,
            message: "calendario non trovato",
        });
        return;
    }


    let appuntamenti = await Promise.all(calendario.appuntamenti.map(async (appuntamentoID) => {
        let appuntamento = await Appuntamento.findById(appuntamentoID);
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

    if (checkCommonParams(req, res)) {

        const appuntamento = new Appuntamento({
            titolo: req.body.title,
            data: req.body.date,
            descrizione: req.body.descrizione,
            involves: req.body.involved
        });

        appuntamento.save();

        let missingUsers = [];
        let calendarioUtente;

        await Promise.all(appuntamento.involves.map(async (involved) => {
            let utente = await Utente.findById(involved);
            if (!utente) {
                missingUsers.push(involved);
            } else {
                calendarioUtente = await Calendario.findById(utente.idCalendario);
                calendarioUtente.appuntamenti.push(appuntamento._id);
                await calendarioUtente.save();
            }
        }));

        if (missingUsers.length > 0) {
            res.location("/api/v1/appuntamenti/" + appuntamento._id)
            res.status(206);
            res.json({
                success: false,
                message: "uno degli utenti coinvolti non è stato trovato",
                missingUser: "id utente non trovato: " + missingUsers,
            });
            await Promise.all(appuntamento.involves.map(async (involved) => {
                let utente = await Utente.findById(involved);
                if (utente) {
                    calendarioUtente = await Calendario.findById(utente.idCalendario);
                    calendarioUtente.appuntamenti.pull(appuntamento._id);
                    await calendarioUtente.save();
                }
            }));
            appuntamento.deleteOne();
            return;
        } else {
            res.location("/api/v1/appuntamenti/" + appuntamento._id).status(201).send();
        }

        console.log('Appointment saved successfully!');
    }
});



router.post('/corso', async (req, res) => {

    if (checkCommonParams(req, res)) {

        let utente = await Utente.findOne({ email: req.loggedUser.email });

        if (utente.ruolo != 'amm') {
            res.status(401);
            res.json({
                success: false,
                message: "utente non amministratore",
            });
            return;
        }

        let palestra = await Palestra.findById(utente.idPalestra);

        // inserire l'appuntamento nel calendario giusto
        let calendario = await Promise.all(palestra.calendariCorsi.map(async (idCalendario) => {
            let temp = await Calendario.findById(idCalendario)
            if (temp.nome == req.body.courseName) {
                return temp;
            }
        }));

        calendario = calendario[0];

        if (!calendario) {
            res.status(404);
            res.json({
                success: false,
                message: "calendario corso non trovato",
            });
            return;
        }

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
            await calendarioUtente.save();
        });

        await calendario.save();
        await palestra.save();
        await appuntamento.save();

        res.location("/api/v1/appuntamenti/" + appuntamento._id).status(201).send();
    }
})


// in req c'è _id dell'appuntamento da togliere
router.delete('', async (req, res) => {

    if (!req.body._id) {
        res.status(400);
        res.json({
            success: false,
            message: "id appuntamento mancante",
        });
        return;
    }

    const appuntamento = await Appuntamento.findById(req.body._id);

    if (!appuntamento) {
        res.status(404);
        res.json({
            success: false,
            message: "appuntamento non trovato",
        });
        return;
    }

    await Promise.all(appuntamento.involves.map(async (involved) => {
        let utente = await Utente.findById(involved);
        let calendarioUtente = await Calendario.findById(utente.idCalendario);
        calendarioUtente.appuntamenti.pull(appuntamento._id);
        await calendarioUtente.save();
    }));

    await appuntamento.deleteOne();

    console.log('Appintment removed successfully!');

    res.status(204).send();
});


const checkCommonParams = function (req, res) {

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

    return true;
}

module.exports = router;