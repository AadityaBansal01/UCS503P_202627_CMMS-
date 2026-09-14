// // Feedback controller functions will go here.
// exports.getFeedback = async (req, res) => {
//   res.json({ success: true, message: "Get feedback endpoint" });
// };

const Feedback = require("../models/Feedback");

// CREATE FEEDBACK
const createFeedback = async (req, res) => {
    try {
        const { meeting, student, rating, comment } = req.body;

        const feedback = await Feedback.create({
            meeting,
            student,
            rating,
            comment
        });

        res.status(201).json({
            success: true,
            message: "Feedback created successfully",
            data: feedback
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET ALL FEEDBACK
const getFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find()
            .populate("meeting")
            .populate("student");

        res.json({
            success: true,
            count: feedback.length,
            data: feedback
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createFeedback,
    getFeedback
};