import { Link } from "react-router-dom";
import DepartmentSummary from "./DepartmentSummary";

export default function AdminDashboard() {
  return (
    <section>
      <div className="page-header">
        <div><p className="eyebrow">Admin Dashboard</p><h2>Department Overview</h2></div>
        <Link className="button" to="/admin/reassign">Reassign Mentee</Link>
      </div>
      <DepartmentSummary compact />
    </section>
  );
}

