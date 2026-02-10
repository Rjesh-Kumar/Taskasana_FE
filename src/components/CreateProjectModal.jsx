import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function CreateProjectModal({ show, handleClose, refresh }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: ""
  });

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      return toast.error("Project name is required");
    }

    try {
      const res = await api("/project/create", "POST", form);

      // ✅ Correct response check
      if (res.project?._id) {
        toast.success("🎉 Project created successfully!");
        handleClose();
        refresh();

        setTimeout(() => {
          navigate("/projects");
        }, 1200);
      }
      else {
        toast.error("❌ Failed to create project");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while creating project");
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
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>Create</Button>
      </Modal.Footer>
    </Modal>
  );
}
