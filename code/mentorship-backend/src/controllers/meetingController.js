// // Meeting controller functions will go here.
// exports.getMeetings = async (req, res) => {
//   res.json({ success: true, message: "Get meetings endpoint" });
// };

// const Meeting = require("../models/Meeting");

// // CREATE MEETING
// const createMeeting = async (req, res) => {
//     try {
//         const { mentor, student, date, agenda, status, notes } = req.body;

//         const meeting = await Meeting.create({
//             mentor,
//             student,
//             date,
//             agenda,
//             status,
//             notes
//         });

//         res.status(201).json({
//             success: true,
//             message: "Meeting created successfully",
//             data: meeting
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // GET ALL MEETINGS
// const getMeetings = async (req, res) => {
//     try {
//         const meetings = await Meeting.find()
//             .populate("mentor")
//             .populate("student");

//         res.json({
//             success: true,
//             count: meetings.length,
//             data: meetings
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// module.exports = {
//     createMeeting,
//     getMeetings
// };

const Meeting = require("../models/Meeting");

// CREATE MEETING
const createMeeting = async (req, res) => {
    try {
        const { mentor, student, date, agenda, status, notes } = req.body;

        // Check if mentor already has a meeting at the same time
        const existingMeeting = await Meeting.findOne({
            mentor,
            date: new Date(date),
            status: { $ne: "cancelled" }
        });

        if (existingMeeting) {
            return res.status(409).json({
                success: false,
                message: "Booking conflict: Mentor already has a meeting at this time"
            });
        }

        const meeting = await Meeting.create({
            mentor,
            student,
            date,
            agenda,
            status,
            notes
        });

        res.status(201).json({
            success: true,
            message: "Meeting created successfully",
            data: meeting
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET ALL MEETINGS
const getMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find()
            .populate("mentor")
            .populate("student");

        res.json({
            success: true,
            count: meetings.length,
            data: meetings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE MEETING NOTES (Faculty)
const updateMeetingNotes = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;

        const meeting = await Meeting.findByIdAndUpdate(
            id,
            { notes },
            { new: true }
        );

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found"
            });
        }

        res.json({
            success: true,
            message: "Meeting notes updated successfully",
            data: meeting
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// CANCEL MEETING
const cancelMeeting = async (req, res) => {
    try {
        const { id } = req.params;

        const meeting = await Meeting.findByIdAndUpdate(
            id,
            { status: "cancelled" },
            { new: true }
        );

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found"
            });
        }

        res.json({
            success: true,
            message: "Meeting cancelled successfully",
            data: meeting
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// module.exports = {
//     createMeeting,
//     getMeetings
// };
module.exports = {
    createMeeting,
    getMeetings,
    updateMeetingNotes,
    cancelMeeting
};