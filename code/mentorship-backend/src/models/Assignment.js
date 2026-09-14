const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        facultyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false
        },

        status: {
            type: String,
            enum: ["pending", "active", "reassigned", "completed"],
            default: "active"
        },

        dateAssigned: {
            type: Date,
            default: Date.now
        },

        reassignedFlag: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Assignment", assignmentSchema);