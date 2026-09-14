import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DepartmentSummary from "./pages/admin/DepartmentSummary";
import ReassignMentee from "./pages/admin/ReassignMentee";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import AddNote from "./pages/faculty/AddNote";
import Availability from "./pages/faculty/Availability";
import FacultyMeetings from "./pages/faculty/FacultyMeetings";
import Mentees from "./pages/faculty/Mentees";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookMeeting from "./pages/student/BookMeeting";
import MeetingHistory from "./pages/student/MeetingHistory";
import MyMentor from "./pages/student/MyMentor";
import RequestMentor from "./pages/student/RequestMentor";
import StudentDashboard from "./pages/student/StudentDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/mentor" element={<MyMentor />} />
            <Route path="/student/request-mentor" element={<RequestMentor />} />
            <Route path="/student/book-meeting" element={<BookMeeting />} />
            <Route path="/student/meeting-history" element={<MeetingHistory />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["faculty"]} />}>
            <Route path="/faculty" element={<FacultyDashboard />} />
            <Route path="/faculty/mentees" element={<Mentees />} />
            <Route path="/faculty/availability" element={<Availability />} />
            <Route path="/faculty/meetings" element={<FacultyMeetings />} />
            <Route path="/faculty/add-note" element={<AddNote />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/reassign" element={<ReassignMentee />} />
            <Route path="/admin/summary" element={<DepartmentSummary />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
