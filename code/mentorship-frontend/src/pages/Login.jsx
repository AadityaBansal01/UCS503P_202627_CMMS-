import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import { useAuth } from "../context/AuthContext";

const roleHome = { student: "/student", faculty: "/faculty", admin: "/admin" };

export default function Login() {
  const { login, isAuthenticated, role, getErrorMessage } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to={roleHome[role] || "/login"} replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form);
      navigate(roleHome[user.role] || "/login", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <p className="eyebrow">Mentorship Portal</p>
        <h1>Login</h1>
        <p className="muted">Access dashboards for students, faculty, and administrators.</p>
        <ErrorMessage message={error} />
        <form onSubmit={handleSubmit} className="form">
          <label>Email
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </label>
          <label>Password
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </label>
          <button type="submit" className="button" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </form>
        <p className="auth-link">Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </section>
  );
}

