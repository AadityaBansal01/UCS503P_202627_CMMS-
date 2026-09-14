// const Assignment = require("../models/Assignment");

// // CREATE ASSIGNMENT
// const createAssignment = async (req, res) => {
//     try {
//         const { studentId, facultyId, status, dateAssigned, reassignedFlag } = req.body;

//         const assignment = await Assignment.create({
//             studentId,
//             facultyId,
//             status,
//             dateAssigned,
//             reassignedFlag
//         });

//         res.status(201).json({
//             success: true,
//             message: "Assignment created successfully",
//             data: assignment
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // GET ALL ASSIGNMENTS
// const getAssignments = async (req, res) => {
//     try {
//         const assignments = await Assignment.find()
//             .populate("studentId")
//             .populate("facultyId");

//         res.json({
//             success: true,
//             count: assignments.length,
//             data: assignments
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// module.exports = {
//     createAssignment,
//     getAssignments
// };

const Assignment = require("../models/Assignment");
const User = require("../models/User");
const Student = require("../models/Student");
const Mentor = require("../models/Mentor");

// CREATE ASSIGNMENT
const createAssignment = async (req, res) => {
    try {
        const { studentId, facultyId, status, dateAssigned, reassignedFlag } = req.body;

        const assignment = await Assignment.create({
            studentId,
            facultyId,
            status,
            dateAssigned,
            reassignedFlag
        });

        res.status(201).json({
            success: true,
            message: "Assignment created successfully",
            data: assignment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET ALL ASSIGNMENTS
const getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find()
            .populate("studentId")
            .populate("facultyId");

        res.json({
            success: true,
            count: assignments.length,
            data: assignments
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// REASSIGN STUDENT TO ANOTHER FACULTY
const reassignStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { facultyId } = req.body;

        // Check whether the new faculty exists
        const faculty = await User.findById(facultyId);

        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: "Faculty not found"
            });
        }

        // Make sure the selected user is actually faculty
        if (faculty.role !== "faculty") {
            return res.status(400).json({
                success: false,
                message: "Selected user is not a faculty member"
            });
        }

        // Find the ASSIGNMENT using the assignment ID
        const assignment = await Assignment.findById(id);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found"
            });
        }

        // Reassign to new faculty
        // assignment.facultyId = facultyId;
        // assignment.reassignedFlag = true;

        // await assignment.save();
        // Reassign to new faculty
        assignment.facultyId = facultyId;
        assignment.reassignedFlag = true;

        await assignment.save();

        // Find the student's Student document
        const student = await Student.findOne({
            user: assignment.studentId
        });

        if (student) {
            // Find the Mentor profile belonging to the new faculty
            const mentor = await Mentor.findOne({
                user: facultyId
            });

            if (mentor) {
                student.mentor = mentor._id;
                await student.save();
            }
        }

        // Return updated assignment with student and faculty details
        const updatedAssignment = await Assignment.findById(id)
            .populate("studentId")
            .populate("facultyId");

        res.json({
            success: true,
            message: "Student reassigned successfully",
            data: updatedAssignment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET DEPARTMENT SUMMARY
// GET DEPARTMENT SUMMARY
const getDepartmentSummary = async (req, res) => {
    try {
        const Meeting = require("../models/Meeting");

        const totalStudents = await User.countDocuments({
            role: "student"
        });

        const totalFaculty = await User.countDocuments({
            role: "faculty"
        });

        const totalAssignments = await Assignment.countDocuments();

        const activeAssignments = await Assignment.countDocuments({
            status: "active"
        });

        const reassignedStudents = await Assignment.countDocuments({
            reassignedFlag: true
        });

        const totalMeetings = await Meeting.countDocuments();

        const scheduledMeetings = await Meeting.countDocuments({
            status: "scheduled"
        });

        const completedMeetings = await Meeting.countDocuments({
            status: "completed"
        });

        const cancelledMeetings = await Meeting.countDocuments({
            status: "cancelled"
        });

        res.json({
            success: true,
            message: "Department summary fetched successfully",
            data: {
                totalStudents,
                totalFaculty,
                totalAssignments,
                activeAssignments,
                reassignedStudents,
                totalMeetings,
                scheduledMeetings,
                completedMeetings,
                cancelledMeetings
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// REQUEST MENTOR ALLOCATION
const requestMentorAllocation = async (req, res) => {
    try {
        const { studentId, facultyId } = req.body;

        // Check if student exists
        const student = await User.findById(studentId);

        if (!student || student.role !== "student") {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        // If a faculty was specified, check that the faculty exists
        if (facultyId) {
            const faculty = await User.findById(facultyId);

            if (!faculty || faculty.role !== "faculty") {
                return res.status(404).json({
                    success: false,
                    message: "Faculty not found"
                });
            }
        }

        // Check if student already has a pending request
        const existingRequest = await Assignment.findOne({
            studentId,
            status: "pending"
        });

        if (existingRequest) {
            return res.status(409).json({
                success: false,
                message: "Student already has a pending mentor allocation request"
            });
        }

        const assignment = await Assignment.create({
            studentId,
            facultyId,
            status: "pending",
            reassignedFlag: false
        });

        res.status(201).json({
            success: true,
            message: "Mentor allocation request submitted successfully",
            data: assignment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET PENDING MENTOR REQUESTS FOR FACULTY
const getPendingRequests = async (req, res) => {
    try {
        const requests = await Assignment.find({
            status: "pending"
        })
            .populate("studentId")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: requests.length,
            data: requests
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// APPROVE MENTOR REQUEST
const approveMentorRequest = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the faculty's User account from the JWT
        const facultyId = req.user.id;

        const faculty = await User.findById(facultyId);

        if (!faculty || faculty.role !== "faculty") {
            return res.status(403).json({
                success: false,
                message: "Only faculty can approve mentor requests"
            });
        }

        // Find the faculty's Mentor profile
        const mentor = await Mentor.findOne({
            user: facultyId
        });

        if (!mentor) {
            return res.status(404).json({
                success: false,
                message: "Mentor profile not found for this faculty"
            });
        }

        // Find pending assignment
        const assignment = await Assignment.findById(id);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "Mentor request not found"
            });
        }

        if (assignment.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "This mentor request is no longer pending"
            });
        }

        // Assign this faculty to the student
        assignment.facultyId = facultyId;
        assignment.status = "active";
        assignment.reassignedFlag = false;

        await assignment.save();

        // Update Student document
        const student = await Student.findOne({
            user: assignment.studentId
        });

        if (student) {
            student.mentor = mentor._id;
            await student.save();
        }

        const updatedAssignment = await Assignment.findById(id)
            .populate("studentId")
            .populate("facultyId");

        res.json({
            success: true,
            message: "Mentor request approved successfully",
            data: updatedAssignment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// module.exports = {
//     createAssignment,
//     getAssignments,
//     reassignStudent,
//     getDepartmentSummary,
//     requestMentorAllocation,
//     approveMentorRequest
// };
module.exports = {
    createAssignment,
    getAssignments,
    reassignStudent,
    getDepartmentSummary,
    requestMentorAllocation,
    getPendingRequests,
    approveMentorRequest
};