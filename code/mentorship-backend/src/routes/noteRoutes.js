const express = require("express");

const {
    createNote,
    getNotes,
    getMeetingNotes
} = require("../controllers/noteController");

const router = express.Router();

// Create a note
router.post("/", createNote);

// Get all notes
router.get("/", getNotes);

// Get notes for a specific meeting
router.get("/meeting/:meetingId", getMeetingNotes);

module.exports = router;