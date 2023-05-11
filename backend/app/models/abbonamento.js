var mongoose = require('mongoose');
var Schema = mongoose.Schema;

new Schema({
    descrizione: String,
    dataInizio: Date,
    durata: Number,
    idPalestra: String
})

module.exports = mongoose.model('abbonamento', Schema);