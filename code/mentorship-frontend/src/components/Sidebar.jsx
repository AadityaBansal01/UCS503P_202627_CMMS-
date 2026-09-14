import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const menus = {
  student: [
    ["Dashboard", "/student"],
    ["My Mentor", "/student/mentor"],
    ["Request Mentor", "/student/request-mentor"],
    ["Book Meeting", "/student/book-meeting"],
    ["Meeting History", "/student/meeting-history"],
  ],
  faculty: [
    ["Dashboard", "/faculty"],
    ["My Mentees", "/faculty/mentees"],
    ["Availability", "/faculty/availability"],
    ["Meetings", "/faculty/meetings"],
    ["Add Note", "/faculty/add-note"],
  ],
  admin: [
    ["Dashboard", "/admin"],
    ["Reassign Mentee", "/admin/reassign"],
    ["Department Summary", "/admin/summary"],
  ],
};

export default function Sidebar() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const items = menus[role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span>MMS</span>
        <strong>{role ? `${role[0].toUpperCase()}${role.slice(1)} Workspace` : "Workspace"}</strong>
      </div>
      <nav>
        {items.map(([label, to]) => (
          <NavLink key={to} to={to} end={to === `/${role}`}>
            {label}
          </NavLink>
        ))}
      </nav>
      <button type="button" className="button button-secondary sidebar-logout" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}

