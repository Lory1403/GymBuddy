var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('abbonamento', new Schema({
    descrizione: String,
    dataInizio: Date,
    dataFine: Date, 
    idPalestra: String
    // non manca il prezzo?
}));