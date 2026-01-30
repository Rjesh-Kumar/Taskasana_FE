import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Teams from "./pages/Teams";
import TeamDetails from "./pages/TeamDetails";
import TaskDetails from "./pages/TaskDetails";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Layout from "./components/Layout";

function App() {
  return (
    <AuthProvider>   {/* ✅ WRAP WHOLE APP */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Sidebar layout */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/team/:id" element={<TeamDetails />} />
            <Route path="/task/:id" element={<TaskDetails />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
