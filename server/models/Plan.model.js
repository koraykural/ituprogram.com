const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlanSchema = new Schema({
  link: String, // 'departmentAbbrv/termLink'
  groups: [{
    label: String,
    items: [{
      code: String,
      name: String,
      credits: Number,
      isOpened: Boolean
    }]
  }]
});

module.exports = mongoose.model('Plan', PlanSchema);