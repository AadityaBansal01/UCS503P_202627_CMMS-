// const express = require("express");

// // const {
// //     createAssignment,
// //     getAssignments
// // } = require("../controllers/assignmentController");
// const {
//     createAssignment,
//     getAssignments,
//     reassignStudent
// } = require("../controllers/assignmentController");

// const router = express.Router();

// router.post("/", createAssignment);
// router.get("/", getAssignments);
// router.put("/:id/reassign", reassignStudent);

// module.exports = router;




// const express = require("express");
// const {
//     protect,
//     authorizeRoles
// } = require("../middleware/authMiddleware");

// const {
//     createAssignment,
//     getAssignments,
//     reassignStudent,
//     getDepartmentSummary,
//     requestMentorAllocation
// } = require("../controllers/assignmentController");

// const router = express.Router();

// router.post("/", createAssignment);
// router.get("/", getAssignments);
// router.get("/summary", getDepartmentSummary);
// router.post("/request", protect, requestMentorAllocation);
// // router.put("/:id/reassign", reassignStudent);
// router.put(
//     "/:id/reassign",
//     protect,
//     authorizeRoles("admin"),
//     reassignStudent
// );

// module.exports = router;

const express = require("express");

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");

const {
    createAssignment,
    getAssignments,
    reassignStudent,
    getDepartmentSummary,
    requestMentorAllocation,
    getPendingRequests,
    approveMentorRequest
} = require("../controllers/assignmentController");

const router = express.Router();

router.post("/", createAssignment);
router.get("/", getAssignments);
router.get("/summary", getDepartmentSummary);

router.post(
    "/request",
    protect,
    authorizeRoles("student"),
    requestMentorAllocation
);

// FACULTY MENTOR REQUEST WORKFLOW
router.get(
    "/pending",
    protect,
    authorizeRoles("faculty"),
    getPendingRequests
);

router.put(
    "/:id/approve",
    protect,
    authorizeRoles("faculty"),
    approveMentorRequest
);

// ADMIN REASSIGNMENT
router.put(
    "/:id/reassign",
    protect,
    authorizeRoles("admin"),
    reassignStudent
);

module.exports = router;