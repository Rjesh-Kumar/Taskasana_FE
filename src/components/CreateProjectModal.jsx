import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import api from "../api/api";

export default function CreateProjectModal({ show, handleClose, refresh }) {
  const [teams, setTeams] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    teamId: ""
  });

  useEffect(() => {
    if (show) {
      api("/team") // make sure this route exists
        .then(data => setTeams(data))
        .catch(err => console.error(err));
    }
  }, [show]);

  const handleSubmit = async () => {
    await api("/project/create", "POST", form); // ✅ FIXED URL
    refresh();
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          placeholder="Project Name"
          className="mb-2"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <Form.Control
          placeholder="Description"
          className="mb-2"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* TEAM SELECT */}
        <Form.Select
          className="mb-2"
          onChange={(e) => setForm({ ...form, teamId: e.target.value })}
        >
          <option value="">Select Team</option>
          {teams.map(team => (
            <option key={team._id} value={team._id}>{team.name}</option>
          ))}
        </Form.Select>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>Create</Button>
      </Modal.Footer>
    </Modal>
  );
}
