import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import StatCard from "../../components/StatCard";
import { useAuth } from "../../context/AuthContext";
import { entityId, getAssignedMentor, getErrorMessage, getPayload, getStudentMeetings, getStudents, userName } from "../../services/api";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [state, setState] = useState({ loading: true, error: "", student: null, mentor: null, meetings: [] });

  useEffect(() => {
    const load = async () => {
      try {
        const students = getPayload(await getStudents());
        const student = students.find((item) => entityId(item.user) === user.id);
        let mentor = null;
        let meetings = [];
        if (student?._id) {
          try {
            mentor = getPayload(await getAssignedMentor(student._id));
          } catch {
            mentor = null;
          }
          meetings = getPayload(await getStudentMeetings(student._id));
        }
        setState({ loading: false, error: "", student, mentor, meetings });
      } catch (err) {
        setState((prev) => ({ ...prev, loading: false, error: getErrorMessage(err) }));
      }
    };
    load();
  }, [user.id]);

  if (state.loading) return <Loading />;

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">Student Dashboard</p>
          <h2>Welcome, {user.name}</h2>
          <p className="muted">{user.department || state.student?.department || "Department not set"}</p>
        </div>
      </div>
      <ErrorMessage message={state.error} />
      {!state.student && <EmptyState title="Student profile not found" message="Your user account exists, but no Student document is linked yet." />}
      <div className="stats-grid">
        <StatCard label="Assigned Mentor" value={state.mentor ? userName(state.mentor) : "None"} tone="blue" />
        <StatCard label="Meetings" value={state.meetings.length} tone="green" />
        <StatCard label="Semester" value={state.student?.semester || "N/A"} tone="gold" />
      </div>
      <div className="action-grid">
        <Link className="action-card" to="/student/mentor"><strong>View Mentor</strong><span>See assigned mentor profile and availability.</span></Link>
        <Link className="action-card" to="/student/request-mentor"><strong>Request Mentor</strong><span>Submit a mentor allocation request.</span></Link>
        <Link className="action-card" to="/student/book-meeting"><strong>Book Meeting</strong><span>Schedule time with a mentor.</span></Link>
        <Link className="action-card" to="/student/meeting-history"><strong>View History</strong><span>Review agendas, notes, and statuses.</span></Link>
      </div>
    </section>
  );
}

