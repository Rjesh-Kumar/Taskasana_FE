import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await api("/auth/register", "POST", form);
    alert(res.message);
    navigate("/login");
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="mb-3">Create Account</h3>
      <form onSubmit={handleRegister}>
        <input className="form-control mb-2" placeholder="Name"
          onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="form-control mb-2" placeholder="Email"
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="password" className="form-control mb-3" placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })} />
        <button className="btn btn-primary w-100">Sign Up</button>
      </form>
      <p className="mt-3 small">Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
