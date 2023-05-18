const express = require('express');
const router = express.Router();
const Calendario = require('./models/calendario');
const Palestra = require('./models/palestra');


// get tutti i calendari
router.get('', async (req, res) => {
    
    let calendari = await Calendario.find({});

    calendari = calendari.map( (calendario) => {
        return {
            self: '/api/v1/calendari/' + calendario.id,
            nome: calendario.nome
        };
    });

    res.status(200).json(calendari);
});

// get calendari per id calendario
router.get('/:id', async (req, res) => {

    let calendario = await Calendario.findById(req.params.id);

    res.status(200).json({
        self: 'api/v1/calendari/' + calendario.id,
        nome: calendario.nome,
        appuntamenti: calendario.appuntamenti
    });
});

router.post('', async (req, res) => {

	let calendario = await new Calendario({
        nome: req.body.nome
    }).save();

    var palestra = new Palestra ({
        nome: "aacac"
    });
    //var palestra = await Palestra.findById(req.body.idPalestra);

    if (!palestra) {
        res.status(404).send();
        console.log('Palestra non trovata');
        return;
    }

    palestra.calendariCorsi.push(calendario._id);
    palestra.save();
    
    console.log('calendar added and saved successfully');

    res.location("/api/v1/books/" + calendario._id).status(201).send();
});


router.delete('/:id', async (req, res) => {
    let calendario = await Calendario.findById(req.params.id).exec();
    if (!calendario) {
        res.status(404).send();
        console.log('calendar not found');
        return;
    }

    var palestra = await Palestra.findById(req.body.idPalestra);

    if (!palestra) {
        res.status(404).send();
        console.log('Palestra non trovata');
        return;
    }

    palestra.calendariCorsi.pull(calendario._id);
    palestra.save();

    await calendario.deleteOne();
    console.log('calendar pulled and removed');
    res.status(204).send();
});


module.exports = router;