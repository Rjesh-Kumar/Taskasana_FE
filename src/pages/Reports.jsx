import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function Reports() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api("/reports/overview").then(setData);
  }, []);

  if (!data) return <p>Loading reports...</p>;

  return (
    <div className="container mt-4">
      <h3>Reports Overview</h3>

      <div className="card p-3 mb-3">
        <h5>Total Work Done Last Week</h5>
        <h2>{data.completedLastWeek}</h2>
      </div>

      <div className="card p-3 mb-3">
        <h5>Total Tasks Pending</h5>
        <h2>{data.pendingTasks}</h2>
      </div>

      <div className="card p-3 mb-3">
        <h5>Tasks Closed by Team</h5>
        {data.closedByTeam.map(t => (
          <div key={t._id}>Team: {t._id} — {t.count} tasks</div>
        ))}
      </div>

      <div className="card p-3 mb-3">
        <h5>Tasks Closed by Owner</h5>
        {data.closedByOwner.map(o => (
          <div key={o._id}>User: {o._id} — {o.count} tasks</div>
        ))}
      </div>
    </div>
  );
}
