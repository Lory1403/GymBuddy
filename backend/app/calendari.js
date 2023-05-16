const express = require('express');
const router = express.Router();
const Calendario = require('./models/calendario');

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
    })
})


router.delete('/:id', async (req, res) => {
    let calendario = await Calendario.findById(req.params.id).exec();
    if (!calendario) {
        res.status(404).send()
        console.log('calendar not found')
        return;
    }

    await calendario.deleteOne()
    console.log('calendar removed')
    res.status(204).send()
});


router.post('', async (req, res) => {

	let calendario = new Calendario({
        nome: req.body.nome
    });
    
	calendario = await calendario.save();
    
    let idCalendario = calendario._id;

    console.log('calendar saved successfully');

    res.location("/api/v1/books/" + idCalendario).status(201).send();
});


module.exports = router;