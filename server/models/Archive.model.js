const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
  crn: String,
  code: String,
  name: String,
  lecturer: String,
  buildings: [String],
  days: [String],
  hours: [String],
  capacity: Number,
  enrolled: Number,
  restricts: [String],
  preReqs: [String]
});

const ArchiveSchema = new Schema({
  term: String,
  codeLetter: String,
  classes: [ClassSchema]
});

module.exports = mongoose.model('Archive', ArchiveSchema);