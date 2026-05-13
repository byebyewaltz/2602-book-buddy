import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api";

export default function Register({ setToken }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstname: "", lastname: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await registerUser(form);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      navigate("/account");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container auth-container">
      <h1>Create an Account</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 0.75rem" }}>
          <label>
            First Name
            <input type="text" name="firstname" value={form.firstname} onChange={handleChange} placeholder="Jane" required />
          </label>
          <label>
            Last Name
            <input type="text" name="lastname" value={form.lastname} onChange={handleChange} placeholder="Doe" required />
          </label>
        </div>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
        </label>
        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min. 8 characters" required minLength={8} />
        </label>
        {error && <p className="status-msg error">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Creating account…" : "Register"}
        </button>
      </form>
      <p>Already have an account? <Link to="/login">Log in here</Link></p>
    </div>
  );
}