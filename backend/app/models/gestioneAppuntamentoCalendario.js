var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('gestioneAppuntamentoCalendario', new Schema({
    idCalendario: [String]
}));