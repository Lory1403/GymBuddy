var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('appuntamento', new Schema({
    isCourse:  { type: Boolean, default: false },
    involves: [String],
    titolo: String,
    descrizione: String,
    data: Date
}));