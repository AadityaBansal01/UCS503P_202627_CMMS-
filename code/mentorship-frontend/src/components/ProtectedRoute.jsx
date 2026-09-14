import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles?.length && !allowedRoles.includes(role)) {
    const fallback = role ? `/${role}` : "/login";
    return <Navigate to={fallback} replace />;
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="content-shell">
        <Navbar />
        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

