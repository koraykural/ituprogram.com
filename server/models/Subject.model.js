const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
    faculty: String,
    subject: {
        name: String,
        abbrv: String,
        links: [{
            name: String,
            link: String
        }]
    }
});

module.exports = mongoose.model('Subject', SubjectSchema);