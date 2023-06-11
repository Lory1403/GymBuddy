require('dotenv').config();
var Utente = require('../app/models/utente'); 
var Calendario = require('../app/models/calendario'); 
var Palestra = require('../app/models/palestra');
var Abbonamento = require('../app/models/abbonamento');
var Appuntamento = require('../app/models/appuntamento');

var mongoose = require('mongoose');
// connect to database
mongoose.connect(process.env.DB_URL)
.then ( () => {
	console.log("Connected to Database")
});

(async () => {
    await Promise.all([
        Utente.deleteMany(),
        Calendario.deleteMany(),
        Palestra.deleteMany(),
        Abbonamento.deleteMany(),
        Appuntamento.deleteMany()
    ]);

    const calendarioUtente = await new Calendario({
        nome: "My calendar"
    }).save();

    const utenteBase = new Utente({ 
        nome: "Utente",
        cognome: "Base",
        email: 'utenteBase@unitn.com',
        password: 'password',
        idCalendario: calendarioUtente._id,
        ruolo: "reg"
    });
    await utenteBase.save();

    const abbonamentoProva = new Abbonamento ({
        descrizione: 'Abbonamento di prova',
        dataInizio: '2022-01-01',
        dataFine: '2022-12-31',
        idPalestra: '456',
        prezzo: 10
    });
    await abbonamentoProva.save();

    const calendarioCorsi = new Calendario({
        nome: "Pilates"
    });
    await calendarioCorsi.save();

    const calendarioAmm = new Calendario({
        nome: "My calendar"
    });
    await calendarioAmm.save();

    const utenteAmm = new Utente({ 
        nome: "Utente",
        cognome: "Amm",
        email: 'utenteAmm@unitn.com',
        password: 'password',
        idCalendario: calendarioAmm._id,
        ruolo: "amm"
    });
    await utenteAmm.save();

    const palestra = new Palestra({
        nome: "Palestra",
        personale: [utenteAmm._id],
        indirizzo: {
            via: "Via Sommarive",
            numeroCivico: "9",
            citta: "Trento"
        },
        calendariCorsi: [calendarioCorsi._id],
        abbonamentiDisponibili: [abbonamentoProva._id]
    });
    await palestra.save();

    utenteAmm.idPalestra = palestra._id;
    await utenteAmm.save();

    process.exit();
})().catch((err) => {
    console.error(err);
    process.exit(1);
});