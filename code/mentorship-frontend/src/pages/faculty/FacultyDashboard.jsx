import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import StatCard from "../../components/StatCard";
import { useAuth } from "../../context/AuthContext";
import { entityId, getErrorMessage, getMentorMentees, getMentors, getPayload } from "../../services/api";

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [state, setState] = useState({ loading: true, error: "", mentor: null, mentees: [] });

  useEffect(() => {
    const load = async () => {
      try {
        const mentor = getPayload(await getMentors()).find((item) => entityId(item.user) === user.id);
        const mentees = mentor?._id ? getPayload(await getMentorMentees(mentor._id)) : [];
        setState({ loading: false, error: "", mentor, mentees });
      } catch (err) {
        setState({ loading: false, error: getErrorMessage(err), mentor: null, mentees: [] });
      }
    };
    load();
  }, [user.id]);

  if (state.loading) return <Loading />;
  return (
    <section>
      <div className="page-header"><div><p className="eyebrow">Faculty Dashboard</p><h2>Welcome, {user.name}</h2><p className="muted">{user.department || "Department not set"}</p></div></div>
      <ErrorMessage message={state.error} />
      {!state.mentor && <EmptyState title="Mentor profile not found" message="Your faculty user account exists, but no Mentor document is linked yet." />}
      <div className="stats-grid">
        <StatCard label="Mentees" value={state.mentees.length} tone="green" />
        <StatCard label="Availability" value={state.mentor?.availability || "Not set"} tone="blue" />
        <StatCard label="Expertise" value={state.mentor?.expertise || "Not set"} tone="gold" />
      </div>
      <div className="action-grid">
        <Link className="action-card" to="/faculty/mentees"><strong>My Mentees</strong><span>View assigned students.</span></Link>
        <Link className="action-card" to="/faculty/availability"><strong>Update Availability</strong><span>Change mentor availability.</span></Link>
        <Link className="action-card" to="/faculty/meetings"><strong>Meetings</strong><span>Review scheduled meetings.</span></Link>
        <Link className="action-card" to="/faculty/add-note"><strong>Add Note</strong><span>Create and view meeting notes.</span></Link>
      </div>
    </section>
  );
}

