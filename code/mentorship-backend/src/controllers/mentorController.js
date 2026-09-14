// // Mentor controller functions will go here.
// exports.getMentors = async (req, res) => {
//   res.json({ success: true, message: "Get mentors endpoint" });
// };

const Mentor = require("../models/Mentor");
const Student = require("../models/Student");

// CREATE MENTOR
const createMentor = async (req, res) => {
    try {
        const { user, department, expertise, availability } = req.body;

        const mentor = await Mentor.create({
            user,
            department,
            expertise,
            availability
        });

        res.status(201).json({
            success: true,
            message: "Mentor created successfully",
            data: mentor
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET ALL MENTORS
const getMentors = async (req, res) => {
    try {
        const mentors = await Mentor.find().populate("user");

        res.json({
            success: true,
            count: mentors.length,
            data: mentors
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET ALL MENTEES FOR A MENTOR
const getMentees = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if mentor exists
        const mentor = await Mentor.findById(id);

        if (!mentor) {
            return res.status(404).json({
                success: false,
                message: "Mentor not found"
            });
        }

        // Find all students assigned to this mentor
        const students = await Student.find({
            mentor: id
        }).populate("user");

        res.json({
            success: true,
            count: students.length,
            data: students
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE MENTOR AVAILABILITY
const updateAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { availability } = req.body;

        // Check if availability was provided
        if (!availability) {
            return res.status(400).json({
                success: false,
                message: "Availability is required"
            });
        }

        // Update mentor availability
        const mentor = await Mentor.findByIdAndUpdate(
            id,
            { availability },
            { new: true }
        ).populate("user");

        if (!mentor) {
            return res.status(404).json({
                success: false,
                message: "Mentor not found"
            });
        }

        res.json({
            success: true,
            message: "Mentor availability updated successfully",
            data: mentor
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createMentor,
    getMentors,
    getMentees,
    updateAvailability
};