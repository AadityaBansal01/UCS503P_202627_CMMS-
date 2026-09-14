export default function EmptyState({ title = "No data found", message = "Nothing to show yet." }) {
  return (
    <div className="empty-state">
      <div className="empty-mark">i</div>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}

