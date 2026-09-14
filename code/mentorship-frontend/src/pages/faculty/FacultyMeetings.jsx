import { useEffect, useState } from "react";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import SuccessMessage from "../../components/SuccessMessage";
import { useAuth } from "../../context/AuthContext";
import { cancelMeeting, entityId, formatDateTime, getErrorMessage, getMeetings, getMentors, getPayload, getStudents, updateMeetingNotes, userName } from "../../services/api";

export default function FacultyMeetings() {
  const { user } = useAuth();
  const [mentorId, setMentorId] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [studentMap, setStudentMap] = useState({});
  const [noteDrafts, setNoteDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    const mentor = getPayload(await getMentors()).find((item) => entityId(item.user) === user.id);
    const [meetingResponse, studentResponse] = await Promise.all([getMeetings(), getStudents()]);
    const allMeetings = getPayload(meetingResponse);
    const students = getPayload(studentResponse);
    const id = mentor?._id || "";
    setMentorId(id);
    setMeetings(id ? allMeetings.filter((meeting) => entityId(meeting.mentor) === id) : []);
    setStudentMap(Object.fromEntries(students.map((student) => [student._id, student])));
    setNoteDrafts(Object.fromEntries(allMeetings.map((meeting) => [meeting._id, meeting.notes || ""])));
  };

  useEffect(() => {
    load().catch((err) => setError(getErrorMessage(err))).finally(() => setLoading(false));
  }, [user.id]);

  const saveNotes = async (meetingId) => {
    setError("");
    setSuccess("");
    try {
      await updateMeetingNotes(meetingId, noteDrafts[meetingId] || "");
      setSuccess("Meeting notes updated successfully.");
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const cancel = async (meetingId) => {
    setError("");
    setSuccess("");
    try {
      await cancelMeeting(meetingId);
      setSuccess("Meeting cancelled successfully.");
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) return <Loading />;
  return (
    <section>
      <div className="page-header"><div><p className="eyebrow">Faculty</p><h2>Meetings</h2></div></div>
      <ErrorMessage message={error} />
      <SuccessMessage message={success} />
      {!mentorId ? <EmptyState title="Mentor profile not found" message="Meetings require a Mentor document linked to your user account." /> : meetings.length === 0 ? <EmptyState title="No meetings found" message="Student bookings will appear here." /> : (
        <div className="meeting-list">
          {meetings.map((meeting) => (
            <article className="meeting-card" key={meeting._id}>
              <div><strong>{formatDateTime(meeting.date)}</strong><span className={`status ${meeting.status}`}>{meeting.status}</span></div>
              <p><b>Student:</b> {userName(studentMap[entityId(meeting.student)] || meeting.student)}</p>
              <p><b>Agenda:</b> {meeting.agenda || "N/A"}</p>
              <label>Notes<textarea rows="3" value={noteDrafts[meeting._id] || ""} onChange={(e) => setNoteDrafts({ ...noteDrafts, [meeting._id]: e.target.value })} /></label>
              <div className="button-row">
                <button type="button" className="button button-secondary" onClick={() => saveNotes(meeting._id)}>Update Notes</button>
                {meeting.status !== "cancelled" && <button type="button" className="button button-danger" onClick={() => cancel(meeting._id)}>Cancel Meeting</button>}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
