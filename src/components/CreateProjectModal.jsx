import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import api from "../api/api";

export default function CreateProjectModal({ show, handleClose, refresh }) {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "To Do",
    teamId: "", // Added team field
  });

  // Load teams when modal opens
  useEffect(() => {
    if (show) {
      api("/team")
        .then(data => setTeams(data))
        .catch(err => {
          console.error("Error loading teams:", err);
          toast.error("Failed to load teams");
        });
    }
  }, [show]);

  // In CreateProjectModal.jsx
const handleSubmit = async () => {
  if (!form.name.trim()) {
    return toast.error("Project name is required");
  }

  // ADD THIS CHECK:
  if (!form.teamId) {
    return toast.error("Please select a team for the project");
  }

  try {
    await api("/project/create", "POST", {
      name: form.name,
      description: form.description,
      status: form.status,
      teamId: form.teamId, // ← This should now be required
    });
    
    toast.success("🎉 Project created successfully!");
    if (refresh) refresh();
    handleCloseModal();
  } catch (err) {
    console.error(err);
    toast.error(err.message || "Server error while creating project");
  }
};

  const handleCloseModal = () => {
    setForm({
      name: "",
      description: "",
      status: "To Do",
      teamId: "",
    });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Create Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Team Selection - REQUIRED */}
        <Form.Group className="mb-3">
          <Form.Label>Select Team *</Form.Label>
          <Form.Select
            value={form.teamId}
            onChange={(e) => setForm({ ...form, teamId: e.target.value })}
            required
          >
            <option value="">Select a team</option>
            {teams.map(team => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </Form.Select>
          <Form.Text className="text-muted">
            Projects must belong to a team
          </Form.Text>
        </Form.Group>

        {/* Project Name */}
        <Form.Group className="mb-3">
          <Form.Label>Project Name *</Form.Label>
          <Form.Control
            placeholder="Enter project name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </Form.Group>

        {/* Description */}
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Project description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Form.Group>

        {/* Status */}
        <Form.Group className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="To Do">To Do</option>
            <option value="In-progress">In-progress</option>
            <option value="Completed">Completed</option>
            <option value="Blocked">Blocked</option>
          </Form.Select>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={!form.name.trim() || !form.teamId}
        >
          Create Project
        </Button>
      </Modal.Footer>
    </Modal>
  );
}