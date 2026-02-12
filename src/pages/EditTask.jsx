import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import api from "../api/api";
import Loader from "../components/Loader";

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [teams, setTeams] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    loadTask();
    api("/team").then(setTeams);
  }, [id]);

  const loadTask = async () => {
    const res = await api(`/task/${id}`);
    const t = res.task;

    setForm({
      name: t.name,
      description: t.description || "",
      projectId: t.project?._id,
      teamId: t.team?._id,
      dueDate: t.dueDate?.substring(0, 10),
      timeToComplete: t.timeToComplete,
      status: t.status,
      priority: t.priority,
      owners: t.owners?.map(o => o._id) || []
    });

    setTagsInput(t.tags?.join(", ") || "");
  };

  useEffect(() => {
    if (form?.teamId) {
      api(`/team/${form.teamId}`).then(team => setTeamMembers(team.members || []));
    }
  }, [form?.teamId]);

  const handleUpdate = async () => {
    await api(`/task/update/${id}`, "PATCH", {
      ...form,
      tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean)
    });

    navigate(`/task/${id}`);
  };

  if (!form) return <Loader text="Loading task details..." />;


  return (
    <div className="container mt-4">
      <Card className="shadow-sm p-4">
        <h4 className="mb-4">✏️ Edit Task</h4>

        <Form.Group className="mb-3">
          <Form.Label>Task Name</Form.Label>
          <Form.Control
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </Form.Group>

        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
              >
                <option>To Do</option>
                <option>In-progress</option>
                <option>Completed</option>
                <option>Blocked</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Select Team</Form.Label>
          <Form.Select
            value={form.teamId}
            onChange={e => setForm({ ...form, teamId: e.target.value, owners: [] })}
          >
            {teams.map(t => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Assign Owners</Form.Label>
          <div className="border rounded p-2" style={{ maxHeight: "150px", overflowY: "auto" }}>
            {teamMembers.map(member => (
              <Form.Check
                key={member._id}
                type="checkbox"
                label={member.name}
                checked={form.owners.includes(member._id)}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...form.owners, member._id]
                    : form.owners.filter(id => id !== member._id);
                  setForm({ ...form, owners: updated });
                }}
              />
            ))}
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tags</Form.Label>
          <Form.Control
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
        </Form.Group>

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
                value={form.timeToComplete}
                onChange={e => setForm({ ...form, timeToComplete: e.target.value })}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button variant="light" onClick={() => navigate(-1)}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdate}>Save Changes</Button>
        </div>
      </Card>
    </div>
  );
}
