import { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import  api  from "../api/api";

export default function CreateTaskModal({ show, handleClose, refresh }) {
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);

  const [form, setForm] = useState({
    name: "",
    projectId: "",
    teamId: "",
    dueDate: "",
    timeToComplete: ""
  });

  useEffect(() => {
    if (show) {
      api("/project").then(setProjects);
      api("/team").then(setTeams);
    }
  }, [show]);

  const handleSubmit = async () => {
    await api("/task/create", "POST", {
      ...form,
      timeToComplete: Number(form.timeToComplete),
      owners: [],   // can enhance later
      tags: []
    });

    if (refresh) refresh();
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Task</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Select Project */}
        <Form.Group className="mb-3">
          <Form.Label>Select Project</Form.Label>
          <Form.Select
            onChange={(e) => setForm({ ...form, projectId: e.target.value })}
          >
            <option value="">Dropdown</option>
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Task Name */}
        <Form.Group className="mb-3">
          <Form.Label>Task Name</Form.Label>
          <Form.Control
            placeholder="Enter Task Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Form.Group>

        {/* Select Team */}
        <Form.Group className="mb-3">
          <Form.Label>Select Team</Form.Label>
          <Form.Select
            onChange={(e) => setForm({ ...form, teamId: e.target.value })}
          >
            <option value="">Dropdown</option>
            {teams.map(t => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Due Date + Estimated Time */}
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Select Due date</Form.Label>
              <Form.Control
                type="date"
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Estimated Time</Form.Label>
              <Form.Control
                placeholder="Enter Time in Days"
                type="number"
                onChange={(e) =>
                  setForm({ ...form, timeToComplete: e.target.value })
                }
              />
            </Form.Group>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
