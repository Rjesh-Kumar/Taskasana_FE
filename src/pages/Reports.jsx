import { useEffect, useState } from "react";
import { api } from "../api/api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Loader from "../components/Loader";


// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Reports() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api("/reports/overview").then(setData);
  }, []);

 if (!data) return <Loader text="Preparing reports..." />;

  // Prepare chart data
  const teamChartData = {
    labels: data.closedByTeam.map(t => t.teamName),
    datasets: [
      {
        label: "Tasks Closed by Team",
        data: data.closedByTeam.map(t => t.count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const ownerChartData = {
    labels: data.closedByOwner.map(o => o.ownerName),
    datasets: [
      {
        label: "Tasks Closed by Owner",
        data: data.closedByOwner.map(o => o.count),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

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
        <Bar data={teamChartData} />
      </div>

      <div className="card p-3 mb-3">
        <h5>Tasks Closed by Owner</h5>
        <Bar data={ownerChartData} />
      </div>
    </div>
  );
}
