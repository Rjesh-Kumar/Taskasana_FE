import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import api from "../api/api";

export default function CreateProjectModal({ show, handleClose, refresh }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "To Do",
  });

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      return toast.error("Project name is required");
    }

    try {
      await api("/project/create", "POST", form);
      toast.success("🎉 Project created successfully!");
      if (refresh) refresh();  // reload projects immediately
      handleClose();            // close modal
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Server error while creating project");
    }
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
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <Form.Control
          placeholder="Description"
          className="mb-2"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <Form.Select
          className="mb-2"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="To Do">To Do</option>
          <option value="In-progress">In-progress</option>
          <option value="Completed">Completed</option>
          <option value="Blocked">Blocked</option>
        </Form.Select>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>Create</Button>
      </Modal.Footer>
    </Modal>
  );
}
