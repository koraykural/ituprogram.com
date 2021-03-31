const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UpdateSchema = new Schema({
  classes: [
    {
      _id: false,
      code: String,
      situation: String,
      last_update: Date,
    },
  ],
  plans: {
    situation: String,
    last_update: Date,
  },
  opened_classes: {
    situation: String,
    last_update: Date,
  },
});

module.exports = mongoose.model("Update", UpdateSchema);
