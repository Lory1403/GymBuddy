const express = require('express');
const router = express.Router();
const Utente = require('./models/utente'); 
const Calendario = require('./models/calendario');

router.get('/me', async (req,res) => {

    let utente = await Utente.findOne({email: req.loggedUser.email});

    res.status(200).json({
        self: '/api/v1/utenti/' + utente._id,
        email: utente.email
    });
});

// post per creare un utente
router.post('', async (req,res) => {

    var existingUser = await Utente.findOne({
        email: req.body.email
    });

    if (existingUser) {
        res.status(409);
        res.json({
            success: false,
            message: "L'utente esiste già"
        });
        return;
    }

    var calendario = await new Calendario({
        nome: 'My calendar'
    }).save();

    var utente = await new Utente({
        nome: req.body.nome,
        cognome: req.body.cognome,
        email: req.body.email,
        password: req.body.password,
        idCalendario: calendario._id,
        ruolo: req.body.role
    }).save();

    res.status(201).json({
        success: true,
        message: "Utente creato",
        self: '/api/v1/utenti/' + utente._id
    });
});

module.exports = router;