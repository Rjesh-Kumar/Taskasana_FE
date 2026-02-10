import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import StatusBadge from "../components/StatusBadge";
import CreateTaskModal from "../components/CreateTaskModal";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const proj = await api(`/project/${id}`);
      const taskList = await api(`/task/project/${id}`);
      setProject(proj);
      setTasks(taskList);
      setFilteredTasks(taskList);
    } catch (err) {
      console.error("Error fetching project/tasks:", err);
    }
  };

  // 🗑 DELETE PROJECT
  const handleDeleteProject = async () => {
    if (!window.confirm("Delete this project? All tasks will be lost.")) return;
    await api(`/project/${id}`, "DELETE");
    navigate("/dashboard");
  };

  const sortLowHigh = () => setFilteredTasks([...tasks].sort((a, b) => (a.priority || 2) - (b.priority || 2)));
  const sortHighLow = () => setFilteredTasks([...tasks].sort((a, b) => (b.priority || 2) - (a.priority || 2)));
  const newestFirst = () => setFilteredTasks([...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  const oldestFirst = () => setFilteredTasks([...tasks].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  if (!project) return <p>Loading...</p>;

  return (
    <div>
      <h3 className="fw-bold">{project.name}</h3>
      <p className="text-muted">{project.description}</p>

      {/* ACTION BAR */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <button onClick={sortLowHigh} className="btn btn-light btn-sm me-2">Priority Low–High</button>
          <button onClick={sortHighLow} className="btn btn-light btn-sm me-2">Priority High–Low</button>
          <button onClick={newestFirst} className="btn btn-light btn-sm me-2">Newest First</button>
          <button onClick={oldestFirst} className="btn btn-light btn-sm">Oldest First</button>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-danger btn-sm" onClick={handleDeleteProject}>
            Delete Project
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            + New Task
          </button>
        </div>
      </div>

      {/* TASK TABLE */}
      <div className="table-responsive">
        <table className="table align-middle">
          <thead className="table-light">
            <tr>
              <th>Task</th>
              <th>Owners</th>
              <th>Priority</th>
              <th>Due</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No tasks available for this project
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr
                    key={task._id}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/task/${task._id}`)}
                  >
                    <td>{task.name}</td>
                    <td>{task.owners?.map(o => o.name).join(", ") || "—"}</td>
                    <td>{task.priority || "Medium"}</td>
                    <td>{formatDateTime(task.dueDate)}</td>
                    <td><StatusBadge status={task.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
        </table>
      </div>

      <CreateTaskModal show={showModal} handleClose={() => setShowModal(false)} projectId={id} refresh={fetchProject} />
    </div>
  );
}
