import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { api } from "../api/api";

export default function CreateTeamModal({ show, handleClose, refresh }) {
  const [teamName, setTeamName] = useState("");

  const handleSubmit = async () => {
    if (!teamName.trim()) return alert("Team name required");

    await api("/team/create", "POST", { name: teamName });

    refresh();        // refresh team list
    handleClose();    // close modal
    setTeamName("");  // reset
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Team</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Team Name</Form.Label>
          <Form.Control
            placeholder="Enter Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </Form.Group>

        {/* Design ke liye dummy member inputs (backend me abhi use nahi ho raha) */}
        <Form.Group>
          <Form.Label>Add Members</Form.Label>
          <Form.Control className="mb-2" placeholder="Member Name" disabled />
          <Form.Control className="mb-2" placeholder="Member Name" disabled />
          <Form.Control className="mb-2" placeholder="Member Name" disabled />
          <small className="text-muted">
            Members can be added after team creation
          </small>
        </Form.Group>
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
