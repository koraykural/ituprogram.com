const express = require("express");
const routesService = require("./routes.service");
const router = express.Router();

const postFaculty = (req, res) => {
  routesService
    .faculty(req.body.faculty)
    .then((subjects) =>
      subjects
        ? res.json(subjects)
        : res.status(400).json({ error: "Could not get departments of this faculty" })
    )
    .catch((err) => res.status(400).json({ error: err }));
};

const postSubject = (req, res) => {
  routesService
    .subject(req.body.subject)
    .then((terms) =>
      terms
        ? res.json(terms)
        : res.status(400).json({ error: "Could not get terms of this subject" })
    )
    .catch((err) => res.status(400).json({ error: err }));
};

const postClasses = (req, res) => {
  routesService
    .classes(req.body.codeArr)
    .then((classes) =>
      classes
        ? res.json(classes)
        : res.status(400).json({ error: "Could not get classes of this subject" })
    )
    .catch((err) => res.status(400).json({ error: err }));
};

const postClassesBasic = (req, res) => {
  routesService
    .classesBasic(req.body.codeArr)
    .then((classes) =>
      classes
        ? res.json(classes)
        : res.status(400).json({ error: "Could not get classes of this subject" })
    )
    .catch((err) => res.status(400).json({ error: err }));
};

const getPlan = (req, res) => {
  routesService
    .getPlan(req.params.subject + "/" + req.params.term)
    .then((groups) =>
      groups
        ? res.json(groups)
        : res.status(400).json({ error: "Could not get plan of this subject" })
    )
    .catch((err) => res.status(400).json({ error: err }));
};

const postID = (req, res) => {
  routesService
    .postID(req.body)
    .then((id) =>
      id ? res.json(id) : res.status(400).json({ error: "Could not find old id in database" })
    )
    .catch((err) => res.status(400).json({ error: err }));
};

const getID = (req, res) => {
  routesService
    .getID(req.params.id)
    .then((program) =>
      program
        ? res.json(program)
        : res.status(400).json({ error: "Could not get program of this id" })
    )
    .catch((err) => res.status(400).json({ error: err }));
};

const getClass = (req, res) => {
  routesService
    .getClass(req.params.code)
    .then((data) =>
      data ? res.json(data) : res.status(400).json({ error: "Could not get data of this class" })
    )
    .catch((err) => res.status(400).json({ error: err }));
};

const getCode = (req, res) => {
  routesService
    .getCode(req.params.codeLetter)
    .then((data) =>
      data ? res.json(data) : res.status(400).json({ error: "Could not get elements of this code" })
    )
    .catch((err) => res.status(400).json({ error: err }));
};

const archive = (req, res) => {
  routesService
    .archive(req.params.term, req.params.codeLetter)
    .then((classes) =>
      classes ? res.json(classes) : res.status(400).json({ error: "Could not get data now" })
    )
    .catch((err) => res.status(400).json({ error: err }));
};

const updateStatus = (req, res) => {
  routesService
    .updateStatus()
    .then((classes) =>
      classes ? res.json(classes) : res.status(400).json({ error: "Could not get data now" })
    )
    .catch((err) => res.status(400).json({ error: err }));
};

router.post("/faculty", postFaculty);
router.post("/subject", postSubject);
router.post("/classes", postClasses);
router.post("/classes-basic", postClassesBasic);
router.get("/plan/:subject/:term", getPlan);
router.post("/id", postID);
router.get("/id/:id", getID);
router.get("/class/:code", getClass);
router.get("/code/:codeLetter", getCode);
router.get("/archive/:term/:codeLetter", archive);
router.get("/updateStatus", updateStatus);

module.exports = router;
