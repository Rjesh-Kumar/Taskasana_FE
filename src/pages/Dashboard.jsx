import { useEffect, useState } from "react";
import api from "../api/api";
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
  const [activeProjectFilter, setActiveProjectFilter] = useState("all");
  const [activeTaskFilter, setActiveTaskFilter] = useState("all");

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
    console.log("Project filter clicked:", type); // Debug log
    setActiveProjectFilter(type);
    
    let filtered = [...projects];

    switch (type) {
      case "todo": // ← Button should pass "todo"
        filtered = filtered.filter(p => p.status === "To Do");
        break;
      case "inprogress": // ← Button should pass "inprogress"
        filtered = filtered.filter(p => p.status === "In-progress");
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

    console.log("Filtered projects count:", filtered.length);
    setFilteredProjects(filtered);
  };

  /* ---------------- TASK FILTER ---------------- */
  const sortTasks = (type) => {
    console.log("Task filter clicked:", type); // Debug log
    setActiveTaskFilter(type);
    
    let filtered = [...tasks];

    switch (type) {
      case "todo": // ← Button should pass "todo"
        filtered = filtered.filter(t => t.status === "To Do");
        break;
      case "inprogress": // ← Button should pass "inprogress"
        filtered = filtered.filter(t => t.status === "In-progress");
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

    console.log("Filtered tasks count:", filtered.length);
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

      {/* Project Filter - FIXED: Use lowercase values */}
      <div className="mb-3">
        <button 
          onClick={() => sortProjects("all")} 
          className={`btn btn-sm me-2 ${activeProjectFilter === "all" ? "btn-primary" : "btn-outline-secondary"}`}
        >
          All
        </button>
        <button 
          onClick={() => sortProjects("todo")} // ← "todo" not "To Do"
          className={`btn btn-sm me-2 ${activeProjectFilter === "todo" ? "btn-primary" : "btn-outline-secondary"}`}
        >
          To Do
        </button>
        <button 
          onClick={() => sortProjects("inprogress")} // ← "inprogress" not "In-progress"
          className={`btn btn-sm me-2 ${activeProjectFilter === "inprogress" ? "btn-primary" : "btn-outline-secondary"}`}
        >
          In Progress
        </button>
        <button 
          onClick={() => sortProjects("completed")} 
          className={`btn btn-sm me-2 ${activeProjectFilter === "completed" ? "btn-primary" : "btn-outline-secondary"}`}
        >
          Completed
        </button>
        <button 
          onClick={() => sortProjects("blocked")} 
          className={`btn btn-sm ${activeProjectFilter === "blocked" ? "btn-primary" : "btn-outline-secondary"}`}
        >
          Blocked
        </button>
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

      {/* Task Filter - FIXED: Use lowercase values */}
      <div className="mb-3">
        <button 
          onClick={() => sortTasks("all")} 
          className={`btn btn-sm me-2 ${activeTaskFilter === "all" ? "btn-primary" : "btn-outline-secondary"}`}
        >
          All
        </button>
        <button 
          onClick={() => sortTasks("todo")} // ← "todo" not "To Do"
          className={`btn btn-sm me-2 ${activeTaskFilter === "todo" ? "btn-primary" : "btn-outline-secondary"}`}
        >
          To Do
        </button>
        <button 
          onClick={() => sortTasks("inprogress")} // ← "inprogress" not "In-progress"
          className={`btn btn-sm me-2 ${activeTaskFilter === "inprogress" ? "btn-primary" : "btn-outline-secondary"}`}
        >
          In Progress
        </button>
        <button 
          onClick={() => sortTasks("completed")} 
          className={`btn btn-sm me-2 ${activeTaskFilter === "completed" ? "btn-primary" : "btn-outline-secondary"}`}
        >
          Completed
        </button>
        <button 
          onClick={() => sortTasks("blocked")} 
          className={`btn btn-sm ${activeTaskFilter === "blocked" ? "btn-primary" : "btn-outline-secondary"}`}
        >
          Blocked
        </button>
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

      <CreateProjectModal 
        show={showProjectModal} 
        handleClose={() => setShowProjectModal(false)} 
        refresh={fetchData}
      />
      <CreateTaskModal 
        show={showTaskModal} 
        handleClose={() => setShowTaskModal(false)} 
        refresh={fetchData} 
      />
    </div>
  );
}