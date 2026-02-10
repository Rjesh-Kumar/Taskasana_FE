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
      let filtered = [...projects];

      switch (type) {
        case "todo":
          filtered = filtered.filter(p => p.status === "Todo");
          break;
        case "inProgress":
          filtered = filtered.filter(p => p.status === "In Progress");
          break;
        case "completed":
          filtered = filtered.filter(p => p.status === "Completed");
          break;
        case "blocked":
          filtered = filtered.filter(p => p.status === "Blocked");
          break;
        default:
          filtered = [...projects]; // All
      }

      setFilteredProjects(filtered);
    };


  /* ---------------- TASK FILTER ---------------- */
  const sortTasks = (type) => {
  let filtered = [...tasks];

  switch (type) {
    case "todo":
      filtered = filtered.filter(t => t.status === "Todo");
      break;
    case "inProgress":
      filtered = filtered.filter(t => t.status === "In Progress");
      break;
    case "completed":
      filtered = filtered.filter(t => t.status === "Completed");
      break;
    case "blocked":
      filtered = filtered.filter(t => t.status === "Blocked");
      break;
    default:
      filtered = [...tasks];
  }

  setFilteredTasks(filtered);
};

  return (
    <div>
      {/* PROJECTS */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="fw-bold m-0">Projects</h5>
        <button className="btn btn-primary btn-sm" onClick={() => setShowProjectModal(true)}>
          + New Project
        </button>
      </div>

      {/* Project Filter */}
      <div className="mb-3">
        <button onClick={() => sortProjects("all")} className="btn btn-outline-secondary btn-sm me-2">All</button>
        <button onClick={() => sortProjects("todo")} className="btn btn-outline-secondary btn-sm me-2">Todo</button>
        <button onClick={() => sortProjects("inProgress")} className="btn btn-outline-secondary btn-sm me-2">In Progress</button>
        <button onClick={() => sortProjects("completed")} className="btn btn-outline-secondary btn-sm me-2">Completed</button>
        <button onClick={() => sortProjects("blocked")} className="btn btn-outline-secondary btn-sm">Blocked</button>
      </div>

      <div className="row g-4 mb-5">
        {filteredProjects?.length > 0 ? (
          filteredProjects.map((project) => (
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
          <button onClick={() => sortTasks("all")} className="btn btn-outline-secondary btn-sm me-2">All</button>
          <button onClick={() => sortTasks("todo")} className="btn btn-outline-secondary btn-sm me-2">Todo</button>
          <button onClick={() => sortTasks("inProgress")} className="btn btn-outline-secondary btn-sm me-2">In Progress</button>
          <button onClick={() => sortTasks("completed")} className="btn btn-outline-secondary btn-sm me-2">Completed</button>
          <button onClick={() => sortTasks("blocked")} className="btn btn-outline-secondary btn-sm">Blocked</button>
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
