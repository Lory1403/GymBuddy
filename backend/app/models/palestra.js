var mongoose = require('mongoose');
var Schema = mongoose.Schema;

new Schema({
    nome: String,
    personale: [String],
    indirizzo: {
        via: String,
        numeroCivico: String,
        citta: String,
        paese: String,
        cap: Number
    },
 //   idBacheca: String,
 //   idVetrina: String,
    calendariCorsi: [String],
    abbonamentiDisponibili: [String]
})

module.exports = mongoose.model('palestra', Schema);