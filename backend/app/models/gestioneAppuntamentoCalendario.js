var mongoose = require('mongoose');
var Schema = mongoose.Schema;

new Schema({
    idAppuntamento: String,
    idCalendario: [String]
})

module.exports = mongoose.model('gestioneAppuntamentoCalendario', Schema);