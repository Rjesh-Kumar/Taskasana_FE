import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Button, ListGroup } from "react-bootstrap";
import { api } from "../api/api";
import AddMemberModal from "../components/AddMemberModal";
import Loader from "../components/Loader";

export default function TeamDetails() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchTeam = async () => {
    const data = await api(`/team/${id}`);
    setTeam(data);
  };
  
  const handleDeleteTeam = async () => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;
    await api(`/team/${team._id}`, "DELETE");
    window.location.href = "/teams";
  };
  
  useEffect(() => {
    fetchTeam();
  }, [id]);

  if (!team) return <Loader text="Loading team details..." />;


  return (
    <Container className="mt-4">
      <Card className="p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center">
          <h4>{team.name}</h4>
          <div className="d-flex gap-2">
            <Button size="sm" onClick={() => setShowModal(true)}>
              + Add Member
            </Button>
            <Button size="sm" variant="danger" onClick={handleDeleteTeam}>
              Delete Team
            </Button>
          </div>
        </div>


        <hr />

        <h6>Members</h6>
        <ListGroup variant="flush">
          {team.members.map(member => (
            <ListGroup.Item key={member._id}>
              {member.name} ({member.email})
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>

      <AddMemberModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        teamId={team._id}
        refresh={fetchTeam}
      />
    </Container>
  );
}
