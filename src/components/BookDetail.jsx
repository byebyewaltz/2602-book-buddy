import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchBook, reserveBook } from "../api";

export default function BookDetail({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reserving, setReserving] = useState(false);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("success");

  // useCallback so the same reference is used in both useEffect and handleReserve
  const loadBook = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setBook(await fetchBook(id));
    } catch {
      setError("Could not load book details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadBook(); }, [loadBook]);

  async function handleReserve() {
    setReserving(true);
    setMessage("");
    try {
      await reserveBook(id, token);
      setMsgType("success");
      setMessage("Book reserved! Find it on your account page.");
      loadBook();
    } catch (err) {
      setMsgType("error");
      setMessage(err.message);
    } finally {
      setReserving(false);
    }
  }

  if (loading) return <p className="status-msg container">Loading…</p>;
  if (error)   return <p className="status-msg error container">{error}</p>;
  if (!book)   return <p className="status-msg container">Book not found.</p>;

  return (
    <div className="container">
      <button
        className="btn btn-outline"
        style={{ marginBottom: "1.5rem" }}
        onClick={() => navigate("/books")}
      >
        ← Back to Catalog
      </button>

      <div className="book-detail">
        <img
          className="detail-cover"
          src={book.coverimage}
          alt={`Cover of ${book.title}`}
          onError={(e) => {
            e.currentTarget.style.background = "#d0d0c8";
            e.currentTarget.removeAttribute("src");
          }}
        />

        <div className="detail-info">
          <h1>{book.title}</h1>
          <p style={{ color: "#555" }}>by {book.author}</p>

          <span className={`badge ${book.available ? "available" : "unavailable"}`}>
            {book.available ? "Available" : "Checked Out"}
          </span>

          {book.description && (
            <p className="book-description">{book.description}</p>
          )}

          {message && (
            <p className={`status-msg ${msgType}`} style={{ textAlign: "left", padding: 0 }}>
              {message}
            </p>
          )}

          {!token ? (
            <div className="login-prompt">
              <span>Want to reserve this?</span>
              <Link to="/login" className="btn btn-primary">Log In</Link>
              <Link to="/register" className="btn btn-outline">Register</Link>
            </div>
          ) : (
            <button
              className="btn btn-primary reserve-btn"
              onClick={handleReserve}
              disabled={!book.available || reserving}
            >
              {reserving ? "Reserving…" : book.available ? "Reserve Book" : "Unavailable"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 