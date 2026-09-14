const Note = require("../models/Note");
const Meeting = require("../models/Meeting");

// CREATE NOTE
const createNote = async (req, res) => {
    try {
        const { meetingId, content } = req.body;

        // Check if meeting exists
        const meeting = await Meeting.findById(meetingId);

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found"
            });
        }

        const note = await Note.create({
            meetingId,
            content
        });

        res.status(201).json({
            success: true,
            message: "Note created successfully",
            data: note
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET ALL NOTES
const getNotes = async (req, res) => {
    try {
        const notes = await Note.find()
            .populate("meetingId")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: notes.length,
            data: notes
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET NOTES FOR A SPECIFIC MEETING
const getMeetingNotes = async (req, res) => {
    try {
        const { meetingId } = req.params;

        // Check if meeting exists
        const meeting = await Meeting.findById(meetingId);

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found"
            });
        }

        const notes = await Note.find({ meetingId })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: notes.length,
            data: notes
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createNote,
    getNotes,
    getMeetingNotes
};