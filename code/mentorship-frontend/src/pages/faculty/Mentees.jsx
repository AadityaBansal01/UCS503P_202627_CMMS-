import { useEffect, useState } from "react";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import { useAuth } from "../../context/AuthContext";
import { entityId, getErrorMessage, getMentorMentees, getMentors, getPayload, userName } from "../../services/api";

export default function Mentees() {
  const { user } = useAuth();
  const [state, setState] = useState({ loading: true, error: "", mentees: [] });

  useEffect(() => {
    const load = async () => {
      try {
        const mentor = getPayload(await getMentors()).find((item) => entityId(item.user) === user.id);
        const mentees = mentor?._id ? getPayload(await getMentorMentees(mentor._id)) : [];
        setState({ loading: false, error: "", mentees });
      } catch (err) {
        setState({ loading: false, error: getErrorMessage(err), mentees: [] });
      }
    };
    load();
  }, [user.id]);

  if (state.loading) return <Loading />;
  return (
    <section>
      <div className="page-header"><div><p className="eyebrow">Faculty</p><h2>My Mentees</h2></div></div>
      <ErrorMessage message={state.error} />
      {state.mentees.length === 0 ? <EmptyState title="No mentees found" message="Assigned students will appear here." /> : (
        <div className="table-wrap"><table><thead><tr><th>Name</th><th>Roll Number</th><th>Department</th><th>Semester</th></tr></thead><tbody>
          {state.mentees.map((student) => <tr key={student._id}><td>{userName(student)}</td><td>{student.rollNumber || "N/A"}</td><td>{student.department || student.user?.department || "N/A"}</td><td>{student.semester || "N/A"}</td></tr>)}
        </tbody></table></div>
      )}
    </section>
  );
}

