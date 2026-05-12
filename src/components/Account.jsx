import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchMe, fetchReservations, returnBook } from "../api";

export default function Account({ token }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returning, setReturning] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    setError("");
    Promise.all([fetchMe(token), fetchReservations(token)])
      .then(([u, r]) => { setUser(u); setReservations(r); })
      .catch(() => setError("Failed to load account data."))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleReturn(reservationId) {
    setReturning(reservationId);
    setError("");
    try {
      await returnBook(reservationId, token);
      setReservations((prev) => prev.filter((r) => r.id !== reservationId));
    } catch (err) {
      setError(err.message);
    } finally {
      setReturning(null);
    }
  }
  if (!token) {
    return (
      <div className="container account-guest">
        <h1>My Account</h1>
        <p style={{ marginTop: "0.75rem", color: "#555" }}>
          Log in or register to view your profile and reservations.
        </p>
        <div className="guest-actions">
          <Link to="/login" className="btn btn-primary">Log In</Link>
          <Link to="/register" className="btn btn-outline">Register</Link>
        </div>
      </div>
    );
  }

  if (loading) return <p className="status-msg container">Loading…</p>;

  return (
    <div className="container">
      <h1>My Account</h1>

      {error && <p className="status-msg error">{error}</p>}

      <div className="profile-card" style={{ marginTop: "1.25rem" }}>
        <h2 style={{ fontSize: "1.15rem" }}>
          {user?.firstname && user?.lastname
            ? `${user.firstname} ${user.lastname}`
            : user?.firstname ?? "Member"}
        </h2>
        <p style={{ color: "#555", fontSize: "0.95rem" }}>{user?.email}</p>
        <p style={{ fontSize: "0.875rem", color: "#777", marginTop: "0.25rem" }}>
          {reservations.length} book{reservations.length !== 1 ? "s" : ""} reserved
        </p>
      </div>

      <h2 style={{ marginBottom: "0.25rem" }}>My Reservations</h2>

      {reservations.length === 0 ? (
        <div style={{ color: "#555", marginTop: "0.75rem" }}>
          <p>You have no current reservations.</p>
          <button
            className="btn btn-primary"
            style={{ marginTop: "1rem" }}
            onClick={() => navigate("/books")}
          >
            Browse Catalog
          </button>
        </div>
      ) : (
        <ul className="reservation-list">
          {reservations.map((r) => (
            <li key={r.id} className="reservation-item">
              <img
                className="res-cover"
                src={r.book?.coverimage ?? r.coverimage}
                alt={`Cover of ${r.book?.title ?? r.title ?? "book"}`}
                onError={(e) => {
                  e.currentTarget.style.background = "#d0d0c8";
                  e.currentTarget.removeAttribute("src");
                }}
              />
              <div className="res-info">
                <p className="res-title">{r.book?.title ?? r.title ?? "Untitled"}</p>
                <p style={{ fontSize: "0.875rem", color: "#555" }}>
                  by {r.book?.author ?? r.author ?? "Unknown"}
                </p>
              </div>
              <button
                className="btn btn-danger"
                onClick={() => handleReturn(r.id)}
                disabled={returning === r.id}
              >
                {returning === r.id ? "Returning…" : "Return"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
