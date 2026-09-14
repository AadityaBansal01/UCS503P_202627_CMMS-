// const express = require("express");
// const { getStudents } = require("../controllers/studentController");

// const router = express.Router();

// router.get("/", getStudents);

// module.exports = router;

const express = require("express");

const {
    createStudent,
    getStudents,
    getAssignedMentor,
    getStudentMeetings
} = require("../controllers/studentController");

const router = express.Router();

router.post("/", createStudent);
router.get("/", getStudents);
router.get("/:id/meetings", getStudentMeetings);
router.get("/:id/mentor", getAssignedMentor);

module.exports = router;