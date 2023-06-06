var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// tutti i tipi di utenti sono unificati in un solo tipo di utente
// se degli attributi non lo riguardano vengono impostati a null

module.exports = mongoose.model('utente', new Schema({
    googleId: String,
    nome: String,
    cognome: String,
    email: String,
    password: String, // solo se utente registrato tramite form
    idCalendario: String,
    //chat: [String],
    ruolo: String, // {reg, abb, amm, sala}
    idAbbonamento: String,
    // se è un abbonato le schede e le valutazioni sono le sue personali
    // se è un Personale di sala le scede e le valutazioni sono quelle che ha inserito
    // inseriamo propieteario schede e valutazioni direttamente nelle schede e nelle valutazioni 
    // schede: [String],
    // valutazioni: [String]
    idPalestra: String
}));