import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api";

export default function Login({ setToken }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Trim whitespace before sending to the API
      const payload = { email: form.email.trim(), password: form.password.trim() };
      const data = await loginUser(payload);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      navigate("/account");
    } catch (err) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container auth-container">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </label>
        {error && (
          <p className="status-msg error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Signing in…" : "Log In"}
        </button>
      </form>
      <p>
        Don&apos;t have an account?{" "}
        <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}
