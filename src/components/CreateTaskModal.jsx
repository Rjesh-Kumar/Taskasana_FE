import { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import api from "../api/api";

export default function CreateTaskModal({ show, handleClose, refresh }) {
  const [allProjects, setAllProjects] = useState([]); // ALL projects from API
  const [filteredProjects, setFilteredProjects] = useState([]); // Projects filtered by selected team
  const [teams, setTeams] = useState([]);

  const initialState = {
    name: "",
    projectId: "",
    teamId: "",
    dueDate: "",
    timeToComplete: "",
    status: "To Do",
    priority: "Medium",
    description: "",
  };

  const [form, setForm] = useState(initialState);

  // Load ALL projects and teams when modal opens
  useEffect(() => {
    if (show) {
      api("/project")
        .then(data => {
          setAllProjects(data);
          setFilteredProjects(data); // Initially show all projects
        })
        .catch(err => console.error(err));
      
      api("/team")
        .then(setTeams)
        .catch(err => console.error(err));
    }
  }, [show]);

  // When team changes, filter projects for that team
  useEffect(() => {
    if (form.teamId) {
      const filtered = allProjects.filter(
        project => project.team && project.team._id === form.teamId
      );
      setFilteredProjects(filtered);
      
      // Reset project selection if current project doesn't belong to selected team
      if (form.projectId) {
        const currentProject = allProjects.find(p => p._id === form.projectId);
        if (currentProject && currentProject.team._id !== form.teamId) {
          setForm(prev => ({ ...prev, projectId: "" }));
        }
      }
    } else {
      // If no team selected, show all projects
      setFilteredProjects(allProjects);
    }
  }, [form.teamId, allProjects]);

  const handleSubmit = async () => {
    // Validation
    if (!form.name || !form.projectId || !form.teamId || !form.dueDate || !form.timeToComplete) {
      return alert("Please fill all required fields");
    }

    try {
      await api("/task/create", "POST", {
        name: form.name,
        projectId: form.projectId,
        teamId: form.teamId,
        dueDate: form.dueDate,
        timeToComplete: Number(form.timeToComplete),
        status: form.status,
        priority: form.priority,
        description: form.description || ""
      });

      if (refresh) refresh(); // refresh parent dashboard
      handleCloseModal();
    } catch (err) {
      console.error("Task creation error:", err);
      alert("Failed to create task: " + (err.message || "Server error"));
    }
  };

  const handleCloseModal = () => {
    setForm(initialState);
    handleClose();
  };

  // SWAP THE ORDER: Team FIRST, then Project
  return (
    <Modal show={show} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Task</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* TEAM SELECTION - MUST COME FIRST */}
        <Form.Group className="mb-3">
          <Form.Label>Select Team *</Form.Label>
          <Form.Select
            value={form.teamId}
            onChange={e => setForm({ ...form, teamId: e.target.value, projectId: "" })}
            required
          >
            <option value="">Select Team</option>
            {teams.map(t => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* PROJECT SELECTION - FILTERED BY TEAM */}
        <Form.Group className="mb-3">
          <Form.Label>Select Project *</Form.Label>
          <Form.Select
            value={form.projectId}
            onChange={e => setForm({ ...form, projectId: e.target.value })}
            disabled={!form.teamId} // Disable until team is selected
            required
          >
            <option value="">{form.teamId ? "Select Project" : "Select a team first"}</option>
            {filteredProjects.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
            {form.teamId && filteredProjects.length === 0 && (
              <option disabled>No projects found in this team</option>
            )}
          </Form.Select>
          {form.teamId && filteredProjects.length === 0 && (
            <Form.Text className="text-warning">
              This team has no projects. Create a project first.
            </Form.Text>
          )}
        </Form.Group>

        {/* Task Name */}
        <Form.Group className="mb-3">
          <Form.Label>Task Name *</Form.Label>
          <Form.Control
            value={form.name}
            placeholder="Enter Task Name"
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
        </Form.Group>

        {/* Description */}
        <Form.Group className="mb-3">
          <Form.Label>Description (optional)</Form.Label>
          <Form.Control
            value={form.description}
            placeholder="Task description"
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </Form.Group>

        {/* Status */}
        <Form.Group className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Select
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
          >
            <option value="To Do">To Do</option>
            <option value="In-progress">In-progress</option>
            <option value="Completed">Completed</option>
            <option value="Blocked">Blocked</option>
          </Form.Select>
        </Form.Group>

        {/* Priority */}
        <Form.Group className="mb-3">
          <Form.Label>Priority</Form.Label>
          <Form.Select
            value={form.priority}
            onChange={e => setForm({ ...form, priority: e.target.value })}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </Form.Select>
        </Form.Group>

        {/* Due Date + Estimated Time */}
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Due Date *</Form.Label>
              <Form.Control
                type="date"
                value={form.dueDate}
                onChange={e => setForm({ ...form, dueDate: e.target.value })}
                required
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Estimated Time (Days) *</Form.Label>
              <Form.Control
                type="number"
                min="1"
                placeholder="Enter Time in Days"
                value={form.timeToComplete}
                onChange={e => setForm({ ...form, timeToComplete: e.target.value })}
                required
              />
            </Form.Group>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
}