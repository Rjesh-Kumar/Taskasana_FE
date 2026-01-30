export default function StatusBadge({ status }) {
  const colors = {
    "In Progress": "warning",
    "Completed": "success",
    "To Do": "secondary",
  };

  return (
    <span className={`badge bg-${colors[status] || "secondary"}`}>
      {status}
    </span>
  );
}
