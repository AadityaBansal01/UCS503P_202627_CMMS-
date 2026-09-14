import { useState } from "react";
import { Link } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import { createMentor, createStudent, getErrorMessage, getPayload, registerUser } from "../services/api";

export default function Register() {
  const emptyForm = { name: "", email: "", password: "", role: "student", department: "", rollNumber: "", semester: "" };
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const userResponse = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        department: form.department,
      });
      const createdUser = getPayload(userResponse);
      const userId = createdUser?.id || createdUser?._id;

      if (!userId) {
        throw new Error("User was created, but the backend did not return a User ID.");
      }

      try {
        if (form.role === "student") {
          await createStudent({
            user: userId,
            rollNumber: form.rollNumber,
            department: form.department,
            semester: Number(form.semester),
          });
        }

        if (form.role === "faculty") {
          await createMentor({
            user: userId,
            department: form.department,
            expertise: [],
            availability: "",
          });
        }
      } catch (profileError) {
        setError(`Account was created, but profile setup failed: ${getErrorMessage(profileError)}`);
        return;
      }

      setSuccess("Registration successful. Please login.");
      setForm(emptyForm);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-panel wide">
        <p className="eyebrow">Create Account</p>
        <h1>Register</h1>
        <ErrorMessage message={error} />
        <SuccessMessage message={success} />
        <form onSubmit={handleSubmit} className="form grid-form">
          <label>Name<input value={form.name} onChange={(e) => updateField("name", e.target.value)} required /></label>
          <label>Email<input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} required /></label>
          <label>Password<input type="password" minLength="6" value={form.password} onChange={(e) => updateField("password", e.target.value)} required /></label>
          <label>Role
            <select value={form.role} onChange={(e) => updateField("role", e.target.value)}>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <label className="full-field">Department<input value={form.department} onChange={(e) => updateField("department", e.target.value)} required /></label>
          {form.role === "student" && (
            <>
              <label>Roll Number<input value={form.rollNumber} onChange={(e) => updateField("rollNumber", e.target.value)} required /></label>
              <label>Semester<input type="number" min="1" value={form.semester} onChange={(e) => updateField("semester", e.target.value)} required /></label>
            </>
          )}
          <button type="submit" className="button" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
          {success && <Link className="button button-secondary" to="/login">Go to Login</Link>}
        </form>
        <p className="auth-link">Already registered? <Link to="/login">Login</Link></p>
      </div>
    </section>
  );
}
