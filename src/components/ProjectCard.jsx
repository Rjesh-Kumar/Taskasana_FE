import StatusBadge from "./StatusBadge";
import { useNavigate } from "react-router-dom";

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  return (
    <div
      className="card shadow-sm h-100 project-card"
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/project/${project._id}`)}
    >
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between">
          <h5 className="fw-bold">{project.name}</h5>
          <StatusBadge status={project.status} />
        </div>

        <p className="text-muted small flex-grow-1">
          {project.description?.slice(0, 90)}...
        </p>
      </div>
    </div>
  );
}
