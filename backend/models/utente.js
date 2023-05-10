var mongoose = require('mongoose');
var Schema = mongoose.Schema;

new Schema({
    idUtente: String,
    nome: String,
    cognome: String,
    idCalendario: String,
    chat: [String]
})

module.exports = mongoose.model('utente', Schema);