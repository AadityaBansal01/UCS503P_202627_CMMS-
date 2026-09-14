// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");

// const app = express();
// const PORT = process.env.PORT || 5000;

// connectDB();

// app.use(cors());
// app.use(express.json());

// app.get("/api/health", (req, res) => {
//   res.json({
//     success: true,
//     message: "Mentorship Management Backend is running"
//   });
// });

// // API routes will be mounted here.
// // Example:
// // app.use("/api/users", require("./routes/userRoutes"));

// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found"
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Mentorship Management Backend is running"
    });
});

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/mentors", require("./routes/mentorRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/meetings", require("./routes/meetingRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/assignments", require("./routes/assignmentRoutes"));
app.use("/api/notes", require("./routes/noteRoutes"));

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});