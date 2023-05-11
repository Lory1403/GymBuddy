var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('abbonamento', new Schema({
    descrizione: String,
    dataInizio: Date,
    durata: Number,
    idPalestra: String
}));