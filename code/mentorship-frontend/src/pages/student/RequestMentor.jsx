import { useState } from "react";
import ErrorMessage from "../../components/ErrorMessage";
import SuccessMessage from "../../components/SuccessMessage";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage, requestMentorAllocation } from "../../services/api";

export default function RequestMentor() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRequest = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await requestMentorAllocation({ studentId: user.id });
      setSuccess("Mentor allocation request submitted successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="page-header"><div><p className="eyebrow">Student</p><h2>Request Mentor</h2><p className="muted">Submit a mentor allocation request for your account.</p></div></div>
      <ErrorMessage message={error} />
      <SuccessMessage message={success} />
      <div className="detail-card">
        <p>Requesting as <strong>{user.name}</strong> from {user.department || "your department"}.</p>
        <button type="button" className="button" onClick={handleRequest} disabled={loading}>
          {loading ? "Submitting..." : "Request Mentor"}
        </button>
      </div>
    </section>
  );
}

