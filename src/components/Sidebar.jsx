import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `nav-link ${pathname === path ? "fw-bold text-primary" : "text-dark"}`;

  return (
    <div
      className="p-3 border-end"
      style={{ width: "220px", minHeight: "100vh", background: "#fff" }}
    >
      <h5 className="mb-4 text-primary">Taskasana</h5>

      <nav className="nav flex-column gap-2">
        <Link to="/dashboard" className={linkClass("/dashboard")}>Dashboard</Link>
        <Link to="/projects" className={linkClass("/projects")}>Project</Link>
        <Link to="/teams" className={linkClass("/teams")}>Team</Link>
        <Link to="/reports" className={linkClass("/reports")}>Reports</Link>
        <Link to="/settings" className={linkClass("/settings")}>Setting</Link>
      </nav>
    </div>
  );
}
