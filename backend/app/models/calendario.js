var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Calendario', new Schema({
    nome: String,
    appuntamenti: [String]
}));