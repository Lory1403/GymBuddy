var mongoose = require('mongoose');
var Schema = mongoose.Schema;

new Schema({
    idAbbonamento: String,
    descrizione: String,
    dataInizio: Date,
    durata: Number,
    palestra: String //idPalestra
})

module.exports = mongoose.model('abbonamento', Schema);