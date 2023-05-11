var mongoose = require('mongoose');
var Schema = mongoose.Schema;

new Schema({
    idCalendario: [String]
})

module.exports = mongoose.model('gestioneAppuntamentoCalendario', Schema);