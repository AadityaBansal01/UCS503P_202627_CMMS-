import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="navbar">
      <div>
        <p className="eyebrow">University Portal</p>
        <h1>Mentorship Management System</h1>
      </div>
      {user && (
        <div className="nav-user">
          <div>
            <strong>{user.name}</strong>
            <span>{user.role} · {user.department || "Department not set"}</span>
          </div>
          <button type="button" className="button button-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

