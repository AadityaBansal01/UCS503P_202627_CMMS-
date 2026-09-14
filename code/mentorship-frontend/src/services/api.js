import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mentorshipToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("mentorshipToken");
      localStorage.removeItem("mentorshipUser");
      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  },
);

export const getPayload = (response) => response.data?.data ?? response.data;

export const getErrorMessage = (error) => {
  const status = error?.response?.status;
  const message = error?.response?.data?.message || error?.message;

  if (status === 401) return "Session expired. Please login again.";
  if (status === 403) return "Access denied: insufficient permissions.";
  if (status === 404) return message || "Requested data was not found.";
  if (status === 409) return message || "Conflict: this operation cannot be completed.";
  if (status >= 500) return "Server error. Please try again later.";
  if (status >= 400) return message || "Request failed. Please check the entered details.";
  return message || "Network error. Please make sure the backend is running.";
};

export const loginUser = (credentials) => api.post("/users/login", credentials);
export const registerUser = (user) => api.post("/users", user);
export const createStudent = (student) => api.post("/students", student);
export const createMentor = (mentor) => api.post("/mentors", mentor);

export const getUsers = () => api.get("/users");
export const getStudents = () => api.get("/students");
export const getMentors = () => api.get("/mentors");
export const getMeetings = () => api.get("/meetings");
export const getFeedback = () => api.get("/feedback");
export const getAssignments = () => api.get("/assignments");
export const getNotes = () => api.get("/notes");

export const getAssignedMentor = (studentId) => api.get(`/students/${studentId}/mentor`);
export const getStudentMeetings = (studentId) => api.get(`/students/${studentId}/meetings`);
export const getMentorMentees = (mentorId) => api.get(`/mentors/${mentorId}/mentees`);

export const requestMentorAllocation = (payload) => api.post("/assignments/request", payload);
export const bookMeeting = (payload) => api.post("/meetings", payload);
export const updateAvailability = (mentorId, availability) =>
  api.put(`/mentors/${mentorId}/availability`, { availability });
export const addNote = (payload) => api.post("/notes", payload);
export const getMeetingNotes = (meetingId) => api.get(`/notes/meeting/${meetingId}`);
export const getDepartmentSummary = () => api.get("/assignments/summary");
export const reassignStudent = (assignmentId, facultyId) =>
  api.put(`/assignments/${assignmentId}/reassign`, { facultyId });
export const cancelMeeting = (meetingId) => api.put(`/meetings/${meetingId}/cancel`);
export const updateMeetingNotes = (meetingId, notes) => api.put(`/meetings/${meetingId}/notes`, { notes });

export const entityId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
};

export const userName = (value, fallback = "Not available") => {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  const user = value.user || value;
  return user.name || user.email || fallback;
};

export const formatDateTime = (value) => {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
