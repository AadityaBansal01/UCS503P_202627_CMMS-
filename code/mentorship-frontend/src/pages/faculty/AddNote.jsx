import { useEffect, useState } from "react";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import SuccessMessage from "../../components/SuccessMessage";
import { useAuth } from "../../context/AuthContext";
import { addNote, entityId, formatDateTime, getErrorMessage, getMeetingNotes, getMeetings, getMentors, getPayload, getStudents, userName } from "../../services/api";

export default function AddNote() {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [studentMap, setStudentMap] = useState({});
  const [meetingId, setMeetingId] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadNotes = async (id) => {
    if (!id) {
      setNotes([]);
      return;
    }
    setNotes(getPayload(await getMeetingNotes(id)));
  };

  useEffect(() => {
    const load = async () => {
      const mentor = getPayload(await getMentors()).find((item) => entityId(item.user) === user.id);
      const [meetingResponse, studentResponse] = await Promise.all([getMeetings(), getStudents()]);
      const facultyMeetings = mentor?._id ? getPayload(meetingResponse).filter((meeting) => entityId(meeting.mentor) === mentor._id) : [];
      setStudentMap(Object.fromEntries(getPayload(studentResponse).map((student) => [student._id, student])));
      setMeetings(facultyMeetings);
      const firstId = facultyMeetings[0]?._id || "";
      setMeetingId(firstId);
      await loadNotes(firstId);
    };
    load().catch((err) => setError(getErrorMessage(err))).finally(() => setLoading(false));
  }, [user.id]);

  const changeMeeting = async (id) => {
    setMeetingId(id);
    setError("");
    try {
      await loadNotes(id);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    try {
      await addNote({ meetingId, content });
      setSuccess("Note created successfully.");
      setContent("");
      await loadNotes(meetingId);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) return <Loading />;
  return (
    <section>
      <div className="page-header"><div><p className="eyebrow">Faculty</p><h2>Add Note</h2></div></div>
      <ErrorMessage message={error} />
      <SuccessMessage message={success} />
      {meetings.length === 0 ? <EmptyState title="No meetings found" message="Notes can be added after students book meetings." /> : (
        <div className="split-grid">
          <form className="form panel-form" onSubmit={submit}>
            <label>Meeting
              <select value={meetingId} onChange={(e) => changeMeeting(e.target.value)} required>
                {meetings.map((meeting) => <option key={meeting._id} value={meeting._id}>{formatDateTime(meeting.date)} · {userName(studentMap[entityId(meeting.student)] || meeting.student)}</option>)}
              </select>
            </label>
            <label>Note<textarea rows="6" value={content} onChange={(e) => setContent(e.target.value)} required /></label>
            <button type="submit" className="button">Add Note</button>
          </form>
          <div className="detail-card">
            <h3>Existing Notes</h3>
            {notes.length === 0 ? <p className="muted">No notes for this meeting.</p> : notes.map((note) => <div className="note-item" key={note._id}><p>{note.content}</p><span>{formatDateTime(note.createdAt)}</span></div>)}
          </div>
        </div>
      )}
    </section>
  );
}
