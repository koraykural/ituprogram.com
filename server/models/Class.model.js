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
  credits: Number,
  restricts: [String],
  preReqs: [String],
  lastUpdatedAt: Date
});

module.exports = mongoose.model('Class', ClassSchema);