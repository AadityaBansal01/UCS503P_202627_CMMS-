const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rollNumber: { type: String, required: true, unique: true, trim: true },
    department: { type: String, trim: true },
    semester: { type: Number, min: 1, max: 12 },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
