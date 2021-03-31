const {
  SubjectSchema,
  PlanSchema,
  ClassSchema,
  ProgramSchema,
  ArchiveSchema,
  CodeSchema,
  UpdateSchema,
} = require("../db");

const createRandomID = () => {
  // Generate random id
  const chars = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  let id = "";
  for (let i = 0; i < 5; i++) {
    id += chars[Math.floor(Math.random() * 9)];
  }
  return id;
};
const createUniqueID = async () => {
  id = "";
  while (true) {
    id = createRandomID();
    const docs = await ProgramSchema.find({ id });
    if (!docs.length) break;
  }
  return id;
};

const faculty = (selectedFaculty) => {
  return new Promise((resolve, reject) => {
    let returnValue = [];
    SubjectSchema.find({ faculty: selectedFaculty }).exec((err, subjects) => {
      if (err) reject(err);
      else
        subjects.forEach((el) => {
          returnValue.push({ abrv: el.subject.abbrv, name: el.subject.name });
        });

      if (returnValue.length == 0) reject("No subject found");

      resolve(returnValue);
    });
  });
};

const subject = (selectedSubject) => {
  return new Promise((resolve, reject) => {
    let returnValue = [];
    SubjectSchema.find({ "subject.abbrv": selectedSubject }).exec((err, terms) => {
      if (err) reject(err);
      else
        terms.forEach((el) => {
          el.subject.links.forEach((thisLink) => {
            returnValue.push({ name: thisLink.name, link: thisLink.link });
          });
        });

      if (returnValue.length == 0) reject("No subject found");

      resolve(returnValue);
    });
  });
};

const classes = (codeString) => {
  return new Promise((resolve, reject) => {
    const codes = JSON.parse(codeString);
    ClassSchema.find({ code: { $in: codes } }, (err, docs) => {
      if (err) reject(err);
      resolve(docs);
    });
  });
};

const classesBasic = (codeString) => {
  return new Promise(async (resolve, reject) => {
    const codes = JSON.parse(codeString);
    let returnVal = [];
    for (let i = 0; i < codes.length; i++) {
      const code = codes[i];
      await ClassSchema.findOne({ code }, (err, doc) => {
        if (err) {
          reject(err);
          return;
        }
        returnVal.push(doc);
      });
    }
    resolve(returnVal);
  });
};

const getPlan = (link) => {
  return new Promise((resolve, reject) => {
    PlanSchema.findOne({ link }) //
      .exec((err, results) => {
        if (err) reject(err);
        else {
          if (results) {
            resolve(results.groups);
          }
          resolve();
        }
      });
  });
};

const postID = (body) => {
  return new Promise(async (resolve, reject) => {
    let program = body.programData;
    program.lastUpdate = new Date();
    // If editing same program again
    if (body.id) {
      let oldId = body.id;
      const oldDoc = await ProgramSchema.findOneAndUpdate({ id: oldId }, program, {
        useFindAndModify: false,
      });
      if (oldDoc) {
        resolve(oldId);
        return;
      }
      // Else: If somehow old program associated with this id not found
    }

    // Create random unique id
    program.id = await createUniqueID();
    if (!program.id) reject("ID couldnot be generated");

    // Save program data to DB
    const newProgram = new ProgramSchema(program);
    newProgram.save((err) => {
      if (err) reject(err);
      resolve(id);
    });
  });
};

const getID = (id) => {
  return new Promise((resolve, reject) => {
    ProgramSchema.findOne({ id }).exec((err, programData) => {
      if (err) reject(err);
      else {
        resolve(programData);
      }
    });
  });
};

const getClass = (letter) => {
  return new Promise((resolve, reject) => {
    ClassSchema.findOne({ letter })
      .lean()
      .select("course")
      .exec((err, data) => {
        if (err) reject(err);
        else if (data && data.course) resolve(data.course);
        else resolve();
      });
  });
};

const getCode = (letter) => {
  return new Promise((resolve, reject) => {
    CodeSchema.findOne({ letter })
      .lean()
      .select("course")
      .exec((err, data) => {
        if (err) reject(err);
        else if (data && data.course) resolve(data.course);
        else resolve();
      });
  });
};

const archive = (term, codeLetter) => {
  return new Promise((resolve, reject) => {
    ArchiveSchema.findOne({ term, codeLetter }, (err, doc) => {
      if (err) {
        reject(err);
        return;
      }
      if (doc.classes) resolve(doc.classes);
      else resolve();
    });
  });
};

const updateStatus = (term, codeLetter) => {
  return new Promise((resolve, reject) => {
    UpdateSchema.find({})
      .lean()
      .exec((err, docs) => {
        if (err) {
          reject(err);
          return;
        }
        if (docs) {
          resolve(docs[0]);
        }
      });
  });
};

module.exports = {
  faculty,
  subject,
  classes,
  classesBasic,
  getPlan,
  postID,
  getID,
  getCode,
  getClass,
  archive,
  updateStatus,
};
