import { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { api } from "../api/api";

export default function AddMemberModal({ show, handleClose, teamId, refresh }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Fetch all registered users when modal opens
  useEffect(() => {
    if (show) {
      fetchUsers();
    }
  }, [show]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api("/team/users/all"); // ✅ correct route
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
      alert("Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedUser) return alert("Please select a user");

    try {
      const res = await api("/team/add-member", "POST", {
        teamId,
        userId: selectedUser, // ✅ send userId now
      });

      if (res.message === "Member added successfully") {
        refresh();
        handleClose();
        setSelectedUser("");
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error("Add member error", err);
      alert("Something went wrong");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Team Member</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <Form.Group>
            <Form.Label>Select User</Form.Label>
            <Form.Select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">-- Select Registered User --</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </Form.Select>

            <small className="text-muted">
              Only registered users are listed here
            </small>
          </Form.Group>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!selectedUser}>
          Add Member
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
