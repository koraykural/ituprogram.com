const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CodeSchema = new Schema({
  letter: String,
  course: [String]
});

module.exports = mongoose.model('Code', CodeSchema);