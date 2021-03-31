const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProgramSchema = new Schema({
  id: { type : String , unique : true, dropDups: true},
  faculty: String,
  subject: String,
  term: String,
  classes: [String],
  selectedClasses: [String],
  lastUpdate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Program', ProgramSchema);