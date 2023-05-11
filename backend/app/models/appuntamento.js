var mongoose = require('mongoose');
var Schema = mongoose.Schema;

new Schema({
    idAppuntamento: String,
    involves: [String],
    titolo: String,
    descrizione: String,
    data: Date
})

module.exports = mongoose.model('appuntamento', Schema);