import { useEffect, useState } from "react";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import SuccessMessage from "../../components/SuccessMessage";
import { entityId, formatDateTime, getAssignments, getErrorMessage, getPayload, getUsers, reassignStudent, userName } from "../../services/api";

export default function ReassignMentee() {
  const [assignments, setAssignments] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    const [assignmentResponse, userResponse] = await Promise.all([getAssignments(), getUsers()]);
    const allAssignments = getPayload(assignmentResponse);
    const facultyUsers = getPayload(userResponse).filter((item) => item.role === "faculty");
    setAssignments(allAssignments);
    setFaculty(facultyUsers);
    setSelected(Object.fromEntries(allAssignments.map((assignment) => [assignment._id, entityId(assignment.facultyId) || facultyUsers[0]?._id || ""])));
  };

  useEffect(() => {
    load().catch((err) => setError(getErrorMessage(err))).finally(() => setLoading(false));
  }, []);

  const reassign = async (assignmentId) => {
    setError("");
    setSuccess("");
    try {
      await reassignStudent(assignmentId, selected[assignmentId]);
      setSuccess("Student reassigned successfully.");
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) return <Loading />;
  return (
    <section>
      <div className="page-header"><div><p className="eyebrow">Admin</p><h2>Reassign Mentee</h2></div></div>
      <ErrorMessage message={error} />
      <SuccessMessage message={success} />
      {assignments.length === 0 ? <EmptyState title="No assignments found" message="Mentor assignments will appear here." /> : (
        <div className="table-wrap"><table><thead><tr><th>Student</th><th>Current Faculty</th><th>Status</th><th>Date Assigned</th><th>New Faculty</th><th>Action</th></tr></thead><tbody>
          {assignments.map((assignment) => (
            <tr key={assignment._id}>
              <td>{userName(assignment.studentId)}</td>
              <td>{userName(assignment.facultyId, "Unassigned")}</td>
              <td><span className={`status ${assignment.status}`}>{assignment.status}</span></td>
              <td>{formatDateTime(assignment.dateAssigned || assignment.createdAt)}</td>
              <td><select value={selected[assignment._id] || ""} onChange={(e) => setSelected({ ...selected, [assignment._id]: e.target.value })}>{faculty.map((member) => <option key={member._id} value={member._id}>{member.name}</option>)}</select></td>
              <td><button type="button" className="button button-small" onClick={() => reassign(assignment._id)} disabled={!selected[assignment._id]}>Reassign</button></td>
            </tr>
          ))}
        </tbody></table></div>
      )}
    </section>
  );
}

