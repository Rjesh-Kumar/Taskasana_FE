import { useState, useEffect } from "react";
import  { api }  from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/login");
};


  return (
    <div className="container mt-4">
      <h3>Settings</h3>

      {/* PROFILE */}
      <div className="card p-3 mt-3">
        <h5>Profile Settings</h5>
        <p className="text-muted">Profile update feature coming soon.</p>
      </div>

      {/* ACCOUNT */}
      <div className="card p-3 mt-3">
        <h5>Account Settings</h5>
        <p className="text-muted">Password & preferences settings coming soon.</p>
      </div>
      {/* 🔐 SESSION */}
<div className="card p-4 mt-4 shadow-sm border-danger">
  <h5 className="text-danger">Session</h5>
  <p className="text-muted mb-3">Logout from your account on this device.</p>

  <button className="btn btn-outline-danger" onClick={handleLogout}>
    Logout
  </button>
</div>

    </div>
    
  );
}
