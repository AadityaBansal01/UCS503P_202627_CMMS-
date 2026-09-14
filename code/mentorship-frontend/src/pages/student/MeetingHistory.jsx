import { useEffect, useState } from "react";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import { useAuth } from "../../context/AuthContext";
import { entityId, formatDateTime, getErrorMessage, getPayload, getStudentMeetings, getStudents, userName } from "../../services/api";

export default function MeetingHistory() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const students = getPayload(await getStudents());
        const student = students.find((item) => entityId(item.user) === user.id);
        if (student?._id) setMeetings(getPayload(await getStudentMeetings(student._id)));
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user.id]);

  if (loading) return <Loading />;
  return (
    <section>
      <div className="page-header"><div><p className="eyebrow">Student</p><h2>Meeting History</h2></div></div>
      <ErrorMessage message={error} />
      {meetings.length === 0 ? <EmptyState title="No meetings found" message="Booked meetings will appear here." /> : (
        <div className="table-wrap"><table><thead><tr><th>Date</th><th>Mentor</th><th>Agenda</th><th>Status</th><th>Notes</th></tr></thead><tbody>
          {meetings.map((meeting) => <tr key={meeting._id}><td>{formatDateTime(meeting.date)}</td><td>{userName(meeting.mentor)}</td><td>{meeting.agenda || "N/A"}</td><td><span className={`status ${meeting.status}`}>{meeting.status}</span></td><td>{meeting.notes || "No notes"}</td></tr>)}
        </tbody></table></div>
      )}
    </section>
  );
}

