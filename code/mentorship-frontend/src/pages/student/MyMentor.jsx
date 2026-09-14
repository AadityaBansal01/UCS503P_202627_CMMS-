import { useEffect, useState } from "react";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import { useAuth } from "../../context/AuthContext";
import { entityId, getAssignedMentor, getErrorMessage, getPayload, getStudents, userName } from "../../services/api";

export default function MyMentor() {
  const { user } = useAuth();
  const [state, setState] = useState({ loading: true, error: "", mentor: null });

  useEffect(() => {
    const load = async () => {
      try {
        const students = getPayload(await getStudents());
        const student = students.find((item) => entityId(item.user) === user.id);
        if (!student?._id) {
          setState({ loading: false, error: "", mentor: null });
          return;
        }
        const mentor = getPayload(await getAssignedMentor(student._id));
        setState({ loading: false, error: "", mentor });
      } catch (err) {
        if (err?.response?.status === 404) setState({ loading: false, error: "", mentor: null });
        else setState({ loading: false, error: getErrorMessage(err), mentor: null });
      }
    };
    load();
  }, [user.id]);

  if (state.loading) return <Loading />;
  return (
    <section>
      <div className="page-header"><div><p className="eyebrow">Student</p><h2>My Mentor</h2></div></div>
      <ErrorMessage message={state.error} />
      {!state.mentor ? (
        <EmptyState title="No mentor assigned yet." message="You can submit a mentor allocation request from the Request Mentor page." />
      ) : (
        <div className="detail-card">
          <h3>{userName(state.mentor)}</h3>
          <dl>
            <div><dt>Department</dt><dd>{state.mentor.department || state.mentor.user?.department || "Not available"}</dd></div>
            <div><dt>Expertise</dt><dd>{state.mentor.expertise || "Not available"}</dd></div>
            <div><dt>Availability</dt><dd>{state.mentor.availability || "Not available"}</dd></div>
            <div><dt>Email</dt><dd>{state.mentor.user?.email || "Not available"}</dd></div>
          </dl>
        </div>
      )}
    </section>
  );
}

