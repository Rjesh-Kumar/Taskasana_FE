import { useEffect, useState } from "react";
import { api } from "../api/api";
import ProjectCard from "../components/ProjectCard";
import CreateProjectModal from "../components/CreateProjectModal";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");

  const loadProjects = async () => {
    try {
      const data = await api("/project");
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <div className="d-flex">
          <input
            className="form-control me-2"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary">Search</button>
        </div>
        <button className="btn btn-success" onClick={() => setShow(true)}>
          + New Project
        </button>
      </div>

      {filtered.length > 0 ? (
        filtered.map(p => <ProjectCard key={p._id} project={p} />)
      ) : (
        <p className="text-center mt-4 text-muted">No Projects found</p>
      )}

      <CreateProjectModal show={show} handleClose={() => setShow(false)} refresh={loadProjects} />
    </div>
  );
}
