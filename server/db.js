const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;

module.exports = {
  SubjectSchema: require("./models/Subject.model"),
  ClassSchema: require("./models/Class.model"),
  PlanSchema: require("./models/Plan.model"),
  ProgramSchema: require("./models/Program.model"),
  CodeSchema: require("./models/Code.model"),
  ArchiveSchema: require("./models/Archive.model"),
  UpdateSchema: require("./models/Update.model"),
};
