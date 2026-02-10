import { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import api from "../api/api";

export default function CreateTaskModal({ show, handleClose, refresh }) {
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]); // members of selected team

  const initialState = {
    name: "",
    projectId: "",
    teamId: "",
    dueDate: "",
    timeToComplete: "",
    status: "To Do",        // ✅ matches backend enum
    priority: "Medium",
    owners: []
  };
   
  const [form, setForm] = useState(initialState);

  // Load projects and teams when modal opens
  useEffect(() => {
    if (show) {
      api("/project").then(setProjects);
      api("/team").then(setTeams);
    }
  }, [show]);

  // Load team members when team changes
  useEffect(() => {
    if (form.teamId) {
      const team = teams.find(t => t._id === form.teamId);
      if (team) setMembers(team.members || []);
      else setMembers([]);
      setForm(f => ({ ...f, owners: [] })); // reset owners when team changes
    }
  }, [form.teamId, teams]);

  const handleSubmit = async () => {
    // Validation
    if (!form.name || !form.projectId || !form.teamId || !form.dueDate || !form.timeToComplete) {
      alert("Please fill all required fields");
      return;
    }

    // Validate owners are part of team
    const invalidOwners = form.owners.filter(o => !members.includes(o));
    if (invalidOwners.length > 0) {
      alert("One or more selected owners are not members of the selected team");
      return;
    }

    try {
      await api("/task/create", "POST", {
        name: form.name,
        projectId: form.projectId,
        teamId: form.teamId,
        owners: form.owners,
        dueDate: form.dueDate,
        timeToComplete: Number(form.timeToComplete),
        status: form.status,
        priority: form.priority,
        description: form.description || ""
      });

      if (refresh) refresh();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert("Failed to create task: " + err.message);
    }
  };

  const handleCloseModal = () => {
    setForm(initialState);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Task</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Select Project */}
        <Form.Group className="mb-3">
          <Form.Label>Select Project</Form.Label>
          <Form.Select
            value={form.projectId}
            onChange={e => setForm({ ...form, projectId: e.target.value })}
          >
            <option value="">Select Project</option>
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Task Name */}
        <Form.Group className="mb-3">
          <Form.Label>Task Name</Form.Label>
          <Form.Control
            value={form.name}
            placeholder="Enter Task Name"
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </Form.Group>

        {/* Description */}
        <Form.Group className="mb-3">
          <Form.Label>Description (optional)</Form.Label>
          <Form.Control
            value={form.description || ""}
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

        {/* Select Team */}
        <Form.Group className="mb-3">
          <Form.Label>Select Team</Form.Label>
          <Form.Select
            value={form.teamId}
            onChange={e => setForm({ ...form, teamId: e.target.value })}
          >
            <option value="">Select Team</option>
            {teams.map(t => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Select Owners */}
        {members.length > 0 && (
          <Form.Group className="mb-3">
            <Form.Label>Assign Owners</Form.Label>
            <Form.Select
              multiple
              value={form.owners}
              onChange={e =>
                setForm({
                  ...form,
                  owners: Array.from(e.target.selectedOptions, option => option.value)
                })
              }
            >
              {members.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </Form.Select>
          </Form.Group>
        )}

        {/* Due Date + Estimated Time */}
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={form.dueDate}
                onChange={e => setForm({ ...form, dueDate: e.target.value })}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Estimated Time (Days)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Time in Days"
                value={form.timeToComplete}
                onChange={e => setForm({ ...form, timeToComplete: e.target.value })}
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
