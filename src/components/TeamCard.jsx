import { useNavigate } from "react-router-dom";

export default function TeamCard({ team }) {
  const navigate = useNavigate();

  return (
    <div
      className="card p-3 mb-2 shadow-sm"
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/team/${team._id}`)}
    >
      <h5>{team.name}</h5>
      <p className="text-muted small">{team.members.length} Members</p>
    </div>
  );
}
