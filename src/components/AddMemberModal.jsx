import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { api } from "../api/api";

export default function AddMemberModal({ show, handleClose, teamId, refresh }) {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (!email.trim()) return alert("Enter member email");

    const res = await api("/team/add-member", "POST", { teamId, email });

    if (res.message === "Member added successfully") {
      refresh();
      handleClose();
      setEmail("");
    } else {
      alert(res.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Team Member</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group>
          <Form.Label>Member Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter registered user's email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <small className="text-muted">
            User must already have an account
          </small>
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Add Member</Button>
      </Modal.Footer>
    </Modal>
  );
}
