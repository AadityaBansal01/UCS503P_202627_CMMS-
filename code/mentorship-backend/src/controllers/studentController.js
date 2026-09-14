// // Student controller functions will go here.
// exports.getStudents = async (req, res) => {
//   res.json({ success: true, message: "Get students endpoint" });
// };

const Student = require("../models/Student");
const Meeting = require("../models/Meeting");

// CREATE STUDENT
const createStudent = async (req, res) => {
    try {
        const { user, rollNumber, department, semester, mentor } = req.body;

        const student = await Student.create({
            user,
            rollNumber,
            department,
            semester,
            mentor
        });

        res.status(201).json({
            success: true,
            message: "Student created successfully",
            data: student
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET ALL STUDENTS
const getStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .populate("user")
            .populate("mentor");

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

// GET ASSIGNED MENTOR FOR A STUDENT
const getAssignedMentor = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findById(id)
            .populate({
                path: "mentor",
                populate: {
                    path: "user"
                }
            });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        if (!student.mentor) {
            return res.status(404).json({
                success: false,
                message: "No mentor assigned to this student"
            });
        }

        res.json({
            success: true,
            message: "Assigned mentor fetched successfully",
            data: student.mentor
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET MEETING HISTORY FOR A STUDENT
const getStudentMeetings = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if student exists
        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        // Find all meetings for this student
        const meetings = await Meeting.find({
            student: id
        })
            .populate({
                path: "mentor",
                populate: {
                    path: "user"
                }
            })
            .sort({ date: -1 });

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

module.exports = {
    createStudent,
    getStudents,
    getAssignedMentor,
    getStudentMeetings
};