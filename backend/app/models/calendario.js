var mongoose = require('mongoose');
var Schema = mongoose.Schema;

new Schema({
    nome: String,
    appuntamenti: [String]
})

module.exports = mongoose.model('calendario', Schema);