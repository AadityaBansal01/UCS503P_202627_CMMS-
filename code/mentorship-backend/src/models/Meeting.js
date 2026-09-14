const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    date: { type: Date, required: true },
    agenda: { type: String, trim: true },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled"
    },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meeting", meetingSchema);
