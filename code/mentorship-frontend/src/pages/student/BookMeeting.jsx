import { useEffect, useState } from "react";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import SuccessMessage from "../../components/SuccessMessage";
import { useAuth } from "../../context/AuthContext";
import { bookMeeting, entityId, getErrorMessage, getMentors, getPayload, getStudents, userName } from "../../services/api";

export default function BookMeeting() {
  const { user } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [student, setStudent] = useState(null);
  const [form, setForm] = useState({ mentor: "", date: "", agenda: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [studentsResponse, mentorsResponse] = await Promise.all([getStudents(), getMentors()]);
        const foundStudent = getPayload(studentsResponse).find((item) => entityId(item.user) === user.id);
        const mentorList = getPayload(mentorsResponse);
        setStudent(foundStudent || null);
        setMentors(mentorList);
        setForm((prev) => ({ ...prev, mentor: entityId(foundStudent?.mentor) || mentorList[0]?._id || "" }));
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user.id]);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!student?._id) {
      setError("Student profile not found. Meeting booking needs a Student document.");
      return;
    }
    setSaving(true);
    try {
      await bookMeeting({ mentor: form.mentor, student: student._id, date: new Date(form.date).toISOString(), agenda: form.agenda, status: "scheduled" });
      setSuccess("Meeting booked successfully.");
      setForm({ mentor: form.mentor, date: "", agenda: "" });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  return (
    <section>
      <div className="page-header"><div><p className="eyebrow">Student</p><h2>Book Meeting</h2></div></div>
      <ErrorMessage message={error} />
      <SuccessMessage message={success} />
      {!student ? <EmptyState title="Student profile not found" message="Booking requires a Student document linked to your user account." /> : (
        <form className="form panel-form" onSubmit={submit}>
          <label>Mentor
            <select value={form.mentor} onChange={(e) => setForm({ ...form, mentor: e.target.value })} required>
              {mentors.map((mentor) => <option key={mentor._id} value={mentor._id}>{userName(mentor)} · {mentor.department || "Department not set"}</option>)}
            </select>
          </label>
          <label>Date and Time<input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></label>
          <label>Agenda<textarea value={form.agenda} onChange={(e) => setForm({ ...form, agenda: e.target.value })} rows="4" required /></label>
          <button type="submit" className="button" disabled={saving || mentors.length === 0}>{saving ? "Booking..." : "Book Meeting"}</button>
        </form>
      )}
    </section>
  );
}
