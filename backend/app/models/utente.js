var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// tutti i tipi di utenti sono unificati in un solo tipo di utente
// se degli attributi non lo riguardano vengono impostati a null


module.exports = mongoose.model('utente', new Schema({
    idUtente: String,
    nome: String,
    cognome: String,
    idCalendario: String,
    chat: [String],
    role: String,
    abbonamento: {
        descrizione: String,
        dataInizio: Date,
        durata: Number // durata in giorni
    },
    // se è un abbonato le schede e le valutazioni sono le sue personali
    // se è un Personale di sala le scede e le valutazioni sono quelle che ha inserito
    // inseriamo propieteario schede e valutazioni direttamente nelle schede e nelle valutazioni 
    // schede: [String],
    // valutazioni: [String]
    idPalestra: String,
}));