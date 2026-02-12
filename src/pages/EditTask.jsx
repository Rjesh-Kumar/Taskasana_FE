import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Card } from "react-bootstrap";
import api from "../api/api";

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    api(`/task/${id}`).then(res => setTask(res.task));
  }, [id]);

  const handleUpdate = async () => {
    await api(`/task/update/${id}`, "PATCH", {
      status: task.status,
      priority: task.priority,
      tags: task.tags
    });
    navigate(`/task/${id}`);
  };

  if (!task) return <p>Loading...</p>;

  return (
    <Card className="p-4">
      <h4>Edit Task</h4>

      <Form.Group className="mb-3">
        <Form.Label>Status</Form.Label>
        <Form.Select
          value={task.status}
          onChange={e => setTask({ ...task, status: e.target.value })}
        >
          <option>To Do</option>
          <option>In-progress</option>
          <option>Completed</option>
          <option>Blocked</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Priority</Form.Label>
        <Form.Select
          value={task.priority}
          onChange={e => setTask({ ...task, priority: e.target.value })}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Tags (comma separated)</Form.Label>
        <Form.Control
          value={task.tags?.join(", ")}
          onChange={e =>
            setTask({ ...task, tags: e.target.value.split(",").map(t => t.trim()) })
          }
        />
      </Form.Group>

      <Button onClick={handleUpdate}>Save Changes</Button>
      <Button variant="secondary" className="ms-2" onClick={() => navigate(-1)}>
        Cancel
      </Button>
    </Card>
  );
}
