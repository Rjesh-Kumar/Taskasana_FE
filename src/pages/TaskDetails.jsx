import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import StatusBadge from "../components/StatusBadge";

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    const res = await api(`/task/${id}`);
    setTask(res.task);
  };
   
  const handleDeleteTask = async () => {
  if (!window.confirm("Delete this task permanently?")) return;
  await api(`/task/${id}`, "DELETE");
  navigate(`/project/${task.project?._id}`);
};
 

  const markComplete = async () => {
    await api(`/task/update/${id}`, "PATCH", { status: "Completed" });
    loadTask();
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  const getTimeRemaining = () => {
    if (!task?.dueDate) return "N/A";
    const diff = new Date(task.dueDate) - new Date();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours <= 0) return "Overdue";
    const days = Math.floor(hours / 24);
    return days > 0 ? `${days} days left` : `${hours} hours left`;
  };

  if (!task) return <p className="text-center mt-5">Loading task...</p>;

  return (
    <div className="container mt-4">
      <div className="card shadow-sm p-4">
        <h4 className="mb-4">Task: {task.name}</h4>

        <button
          className="btn btn-outline-secondary mb-3"
          onClick={() => navigate(`/project/${task.project?._id}`)}
        >
          ← Back to Project
        </button>

        <div><strong>Project:</strong> {task.project?.name}</div>
        <div><strong>Team:</strong> {task.team?.name}</div>
        <div><strong>Owners:</strong> {task.owners?.map(o => o.name).join(", ")}</div>
        <div><strong>Tags:</strong> {task.tags?.join(", ") || "None"}</div>
        <div><strong>Due Date:</strong> {formatDateTime(task.dueDate)}</div>
        <div><strong>Status:</strong> <StatusBadge status={task.status} /></div>
        <div><strong>Time Remaining:</strong> {getTimeRemaining()}</div>

        {task.status !== "Completed" && (
          <button className="btn btn-success mt-3" onClick={markComplete}>
            ✔ Mark as Complete
          </button>
 
        )}

        <button
            className="btn btn-primary mt-3 ms-2"
            onClick={() => navigate(`/task/edit/${task._id}`)}
          >
            ✏️ Edit Task
        </button>

        <button className="btn btn-danger mt-3 ms-2" onClick={handleDeleteTask}>
          Delete Task
        </button>
      </div>
    </div>
  );
}
