import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import CreateTeamModal from "../components/CreateTeamModal";
import Loader from "../components/Loader";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);


  const fetchTeams = async () => {
  try {
    setLoading(true);
    const data = await api("/team");
    setTeams(data);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h4>Teams</h4>
        <Button onClick={() => setShowModal(true)}>+ Create Team</Button>
      </div>

      {loading ? (
          <Loader text="Loading teams..." />
        ) : (
          <Row>
            {teams.map(team => (
              <Col md={4} key={team._id} className="mb-3">
                <Card
                  className="p-3 shadow-sm"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/team/${team._id}`)}
                >
                  <h6 className="fw-bold">{team.name}</h6>
                  <p className="text-muted small">
                    Members: {team.members?.length || 0}
                  </p>
                </Card>
              </Col>
            ))}
          </Row>
        )}

      <CreateTeamModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        refresh={fetchTeams}
      />
    </Container>
  );
}
