import StatusBadge from "../components/StatusBadge";
import { useNavigate } from "react-router-dom";

export default function TaskCard({ task }) {
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  return (
    <div
      className="card p-3 mb-2 shadow-sm"
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/task/${task._id}`)}
    >
      <div className="d-flex justify-content-between">
        <h6>{task.name}</h6>
        <StatusBadge status={task.status} />
      </div>
      <p className="small text-muted">Due: {formatDate(task.dueDate)}</p>
    </div>
  );
}
