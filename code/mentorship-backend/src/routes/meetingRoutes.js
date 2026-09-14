// const express = require("express");
// const { getMeetings } = require("../controllers/meetingController");

// const router = express.Router();

// router.get("/", getMeetings);

// module.exports = router;

const express = require("express");

// const {
//     createMeeting,
//     getMeetings
// } = require("../controllers/meetingController");
const {
    createMeeting,
    getMeetings,
    updateMeetingNotes,
    cancelMeeting
} = require("../controllers/meetingController");

const router = express.Router();

router.post("/", createMeeting);
router.get("/", getMeetings);
router.put("/:id/notes", updateMeetingNotes);
router.put("/:id/cancel", cancelMeeting);

module.exports = router;