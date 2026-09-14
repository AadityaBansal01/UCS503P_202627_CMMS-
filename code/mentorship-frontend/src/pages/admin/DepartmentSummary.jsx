import { useEffect, useState } from "react";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import StatCard from "../../components/StatCard";
import { getDepartmentSummary, getErrorMessage, getPayload } from "../../services/api";

const stats = [
  ["totalStudents", "Total Students", "blue"],
  ["totalFaculty", "Total Faculty", "green"],
  ["totalAssignments", "Assignments", "gold"],
  ["activeAssignments", "Active Assignments", "blue"],
  ["reassignedStudents", "Reassigned Students", "gold"],
  ["totalMeetings", "Meetings", "green"],
  ["scheduledMeetings", "Scheduled Meetings", "blue"],
  ["completedMeetings", "Completed Meetings", "green"],
  ["cancelledMeetings", "Cancelled Meetings", "red"],
];

export default function DepartmentSummary({ compact = false }) {
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDepartmentSummary()
      .then((response) => setSummary(getPayload(response)))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  return (
    <section>
      {!compact && <div className="page-header"><div><p className="eyebrow">Admin</p><h2>Department Summary</h2></div></div>}
      <ErrorMessage message={error} />
      <div className="stats-grid summary-grid">
        {stats.map(([key, label, tone]) => <StatCard key={key} label={label} value={summary[key]} tone={tone} />)}
      </div>
    </section>
  );
}

