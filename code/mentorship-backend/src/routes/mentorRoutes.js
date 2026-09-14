// const express = require("express");
// const { getMentors } = require("../controllers/mentorController");

// const router = express.Router();

// router.get("/", getMentors);

// module.exports = router;

const express = require("express");

const {
    createMentor,
    getMentors,
    getMentees,
    updateAvailability
} = require("../controllers/mentorController");

const router = express.Router();

router.post("/", createMentor);
router.get("/", getMentors);
router.get("/:id/mentees", getMentees);
router.put("/:id/availability", updateAvailability);

module.exports = router;