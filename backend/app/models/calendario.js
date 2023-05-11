var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('calendario', new Schema({
    nome: String,
    appuntamenti: [String]
}));