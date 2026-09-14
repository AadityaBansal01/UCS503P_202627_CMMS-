const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    department: { type: String, trim: true },
    expertise: [{ type: String, trim: true }],
    availability: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mentor", mentorSchema);
