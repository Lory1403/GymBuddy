const express = require('express');
const router = express.Router();
const Utente = require('./models/utente'); 
const Calendario = require('./models/calendario');

function checkPasswordStrength(password) {
    // Controlla che la password sia lunga almeno 8 caratteri
    if (password.length < 8) {
      return false;
    }
  
    // Controlla che la password non sia interamente composta da numeri
    if (/^\d+$/.test(password)) {
      return false;
    }
  
    // Controlla che la password contenga almeno un carattere minuscolo, uno maiuscolo e un numero
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      return false;
    }
  
    // Se la password supera tutti i controlli, restituisci true
    return true;
  }

// post per creare un utente
router.post('', async (req,res) => {

    var calendario = new Calendario({
        nome: 'My calendar'
    })

    var utente = new Utente({
        nome: req.body.nome,
        cognome: req.body.cognome,
        email: req.body.email,
        password: req.body.password,
        idCalendario: calendario._id,
        ruolo: req.body.role
    });

    var existingUser = await Utente.findOne({
        email: utente.email
    });

    if (existingUser) {
        res.status(409);
        res.json({
            success: false,
            message: "L'utente esiste già",
        });
        return;
    }

    // Meglio implementarlo nel front-end
    if (!checkPasswordStrength(utente.password)) {
        res.status(400);
        res.json({
            success: false,
            message: "Password troppo semplice",
        });
        return;
    }

    calendario.save();
    utente.save();

    console.log('User Saved Successfully');

    res.location("/utenti/" + utente._id).status(201).send();
});


// metodi da aggiungere:
// prenota appuntamento
// disdici appuntamento
// visualizza calendari (solo i nomi)
// visualizza gli appuntamenti di un calendario

module.exports = router;