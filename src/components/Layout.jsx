import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Page Content */}
      <div className="flex-grow-1 p-4" style={{ background: "#f8f9fc", minHeight: "100vh" }}>
        <Outlet />
      </div>
    </div>
  );
}
