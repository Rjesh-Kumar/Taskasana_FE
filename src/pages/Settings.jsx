import { useState, useEffect } from "react";
import  { api }  from "../api/api";

export default function Settings() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [users, setUsers] = useState([]);

  // Load all users
  const fetchUsers = async () => {
    try {
      const res = await api("/users"); // Assuming GET /user returns all users
      setUsers(res);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRegister = async () => {
    setMsg("");

    if (!form.name || !form.email || !form.password) {
      return setMsg("All fields are required");
    }

    try {
      const res = await api("/auth/register", "POST", form);

      if (res.message === "User registered successfully") {
        setMsg("✅ User created! Now you can add them to a team.");
        setForm({ name: "", email: "", password: "" });
        fetchUsers(); // Refresh user list
      } else {
        setMsg("❌ " + res.message);
      }
    } catch (err) {
      console.error(err);
      setMsg("❌ Something went wrong");
    }
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

      {/* 🔥 ADD NEW USER */}
      <div className="card p-4 mt-4 shadow-sm">
        <h5 className="mb-3">Add New User</h5>

        {msg && <div className="alert alert-info py-2">{msg}</div>}

        <div className="mb-2">
          <input
            className="form-control"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="mb-2">
          <input
            className="form-control"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <input
            className="form-control"
            type="password"
            placeholder="Temporary Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button className="btn btn-primary" onClick={handleRegister}>
          Create User
        </button>
      </div>

      {/* 📝 ALL USERS */}
      <div className="card p-4 mt-4 shadow-sm">
        <h5>All Users</h5>
        {users.length === 0 ? (
          <p className="text-muted">No users found</p>
        ) : (
          <ul className="list-group">
            {users.map((user) => (
              <li
                key={user._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  {user.name} ({user.email})
                </span>
                {user.isOwner && (
                  <span className="badge bg-success rounded-pill">Owner</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
