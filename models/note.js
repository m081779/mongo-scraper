const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var noteSchema = new Schema({
  title: String,
  body: String
});

const Note = module.exports = mongoose.model('Note', noteSchema);
