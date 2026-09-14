import { useEffect, useState } from "react";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import SuccessMessage from "../../components/SuccessMessage";
import { useAuth } from "../../context/AuthContext";
import { entityId, getErrorMessage, getMentors, getPayload, updateAvailability } from "../../services/api";

export default function Availability() {
  const { user } = useAuth();
  const [mentor, setMentor] = useState(null);
  const [availability, setAvailability] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const found = getPayload(await getMentors()).find((item) => entityId(item.user) === user.id);
        setMentor(found || null);
        setAvailability(found?.availability || "");
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user.id]);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const updated = getPayload(await updateAvailability(mentor._id, availability));
      setMentor(updated);
      setSuccess("Mentor availability updated successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  return (
    <section>
      <div className="page-header"><div><p className="eyebrow">Faculty</p><h2>Availability</h2></div></div>
      <ErrorMessage message={error} />
      <SuccessMessage message={success} />
      {!mentor ? <EmptyState title="Mentor profile not found" message="Availability updates require a Mentor document linked to your user account." /> : (
        <form className="form panel-form" onSubmit={submit}>
          <label>Availability<textarea rows="4" value={availability} onChange={(e) => setAvailability(e.target.value)} placeholder="Monday to Friday, 9 AM to 5 PM" required /></label>
          <button type="submit" className="button" disabled={saving}>{saving ? "Updating..." : "Update Availability"}</button>
        </form>
      )}
    </section>
  );
}

