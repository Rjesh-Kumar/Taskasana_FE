import { useEffect, useState } from "react";
import api from "../api/api";
import { BsSearch } from "react-icons/bs";
import ProjectCard from "../components/ProjectCard";
import TaskCard from "../components/TaskCard";
import CreateProjectModal from "../components/CreateProjectModal";
import CreateTaskModal from "../components/CreateTaskModal";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const projectRes = await api("/project"); 
      const taskRes = await api("/task");       

      setProjects(projectRes);
      setFilteredProjects(projectRes);
      setTasks(taskRes);
      setFilteredTasks(taskRes);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  /* ---------------- PROJECT FILTER ---------------- */
  const sortProjects = (type) => {
    let sorted = [...projects];
    switch(type) {
      case "inProgress":
        sorted = sorted.filter(p => p.status === "In Progress");
        break;
      case "completed":
        sorted = sorted.filter(p => p.status === "Completed");
        break;
      default:
        sorted = [...projects];
    }
    setFilteredProjects(sorted);
  };

  /* ---------------- TASK FILTER ---------------- */
  const sortTasks = (type) => {
    let sorted = [...tasks];
    switch(type) {
      case "inProgress":
        sorted = sorted.filter(t => t.status === "In Progress");
        break;
      case "completed":
        sorted = sorted.filter(t => t.status === "Completed");
        break;
      default:
        sorted = [...tasks];
    }
    setFilteredTasks(sorted);
  };

  return (
    <div>
      {/* SEARCH BAR */}
      <div className="d-flex justify-content-end mb-4">
        <div className="input-group mx-auto w-100" style={{ maxWidth: "1000px" }}>
          <input type="text" className="form-control" placeholder="Search" />
          <button className="btn btn-outline-secondary">
            <BsSearch />
          </button>
        </div>
      </div>

      {/* PROJECTS */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="fw-bold m-0">Projects</h5>
        <button className="btn btn-primary btn-sm" onClick={() => setShowProjectModal(true)}>
          + New Project
        </button>
      </div>

      {/* Project Filter */}
      <div className="mb-3">
        <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => sortProjects("all")}>All</button>
        <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => sortProjects("inProgress")}>In Progress</button>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => sortProjects("completed")}>Completed</button>
      </div>

      <div className="row g-4 mb-5">
        {filteredProjects?.length > 0 ? (
          filteredProjects.slice(0, 3).map((project) => (
            <div className="col-md-4" key={project._id}>
              <ProjectCard project={project} />
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-muted text-center">No projects found</p>
          </div>
        )}
      </div>

      {/* TASKS */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="fw-bold m-0">My Tasks</h5>
        <button className="btn btn-primary btn-sm" onClick={() => setShowTaskModal(true)}>
          + New Task
        </button>
      </div>

      {/* Task Filter */}
      <div className="mb-3">
        <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => sortTasks("all")}>All</button>
        <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => sortTasks("inProgress")}>In Progress</button>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => sortTasks("completed")}>Completed</button>
      </div>

      <div className="row g-4">
        {filteredTasks?.length > 0 ? (
          filteredTasks.map((task) => (
            <div className="col-md-4" key={task._id}>
              <TaskCard task={task} />
            </div>
          ))
        ) : (
          <p className="text-muted">No tasks found</p>
        )}
      </div>

      <CreateProjectModal show={showProjectModal} handleClose={() => setShowProjectModal(false)} />
      <CreateTaskModal show={showTaskModal} handleClose={() => setShowTaskModal(false)} refresh={fetchData} />
    </div>
  );
}
