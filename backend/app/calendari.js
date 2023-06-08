const express = require('express');
const router = express.Router();
const Calendario = require('./models/calendario');
const Palestra = require('./models/palestra');


// get tutti i calendari
router.get('', async (req, res) => {

    let calendari = await Calendario.find({});

    calendari = calendari.map((calendario) => {
        return {
            self: '/api/v1/calendari/' + calendario.id,
            nome: calendario.nome
        };
    });

    res.status(200).json(calendari);
});

// get calendari per id calendario
router.get('/byid', async (req, res) => {

    if (!req.body.id) {
        res.status(400).json({
            success: false,
            message: "id non inserito"
        }).send();
        return;
    }

    let calendario = await Calendario.findById(req.body.id);

    if (!calendario) {
        res.status(404).json({
            success: false,
            message: "calendario non trovato"
        }).send();
        console.log('calendar not found');
        return;
    }

    res.status(200).json({
        self: 'api/v1/calendari/' + calendario.id,
        nome: calendario.nome,
        appuntamenti: calendario.appuntamenti
    });
});

router.post('', async (req, res) => {

    if (!req.body.nome) {
        res.status(400).json({
            success: false,
            message: "nome non inserito"
        }).send();
        return;
    }

    let calendario = await new Calendario({
        nome: req.body.nome
    }).save();

    if (!req.body.idPalestra) {
        res.status(400).json({
            success: false,
            message: "idPalestra non inserito"
        }).send();
        return;
    }

    var palestra = await Palestra.findById(req.body.idPalestra);

    if (!palestra) {
        res.status(404).json({
            success: false,
            message: "palestra non trovata"
        }).send();
        console.log('Palestra non trovata');
        return;
    }

    palestra.calendariCorsi.push(calendario._id);
    palestra.save();

    console.log('Calendar added and saved successfully');

    res.status(201).json({ self: "/api/v1/calendari/" + calendario._id }).send();
});


router.delete('', async (req, res) => {

    if (!req.body.id) {
        res.status(400).json({
            success: false,
            message: "idCalendario non inserito"
        }).send();
        return;
    }

    let calendario = await Calendario.findById(req.body.id);

    if (!calendario) {
        res.status(404).json({
            success: false,
            message: "calendario non trovato"
        }).send();
        console.log('calendar not found');
        return;
    }

    if (!req.body.idPalestra) {
        res.status(400).json({
            success: false,
            message: "idPalestra non inserito"
        }).send();
        return;
    }

    let palestra = await Palestra.findById(req.body.idPalestra);

    if (!palestra) {
        res.status(404).json({
            success: false,
            message: "palestra non trovata"
        }).send();
        console.log('Palestra non trovata');
        return;
    }

    palestra.calendariCorsi.pull(calendario._id);
    palestra.save();

    await calendario.deleteOne();
    console.log('calendar pulled and removed');
    res.status(200).json({
        success: true,
        message: "calendario rimosso con sucesso"
    });
});


module.exports = router;