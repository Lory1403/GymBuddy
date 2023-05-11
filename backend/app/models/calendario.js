var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('calendario', new Schema({
    involves: [String],
    titolo: String,
    descrizione: String,
    data: Date
}));