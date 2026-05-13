import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAllBooks } from "../api";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAllBooks()
      .then(setBooks)
      .catch(() => setError("Could not load books. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = books.filter((b) => {
    const q = search.toLowerCase();
    return b.title?.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q);
  });

  return (
    <div className="container">
      <h1>Library Catalog</h1>
      <p style={{ color: "#555", marginTop: "0.25rem" }}>
        {books.length > 0 ? `${books.length} books in the collection` : "Browse our collection"}
      </p>

      <input
        className="search-input"
        type="text"
        placeholder="Search by title or author…"
        aria-label="Search books by title or author"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p className="status-msg">Loading books…</p>}
      {error && <p className="status-msg error" role="alert">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <p className="status-msg">
          {search ? "No books match your search." : "No books available."}
        </p>
      )}
      {!loading && !error && filtered.length > 0 && (
        <div className="book-grid">
          {filtered.map((book) => (
            <Link key={book.id} to={`/books/${book.id}`} className="book-card">
              <img
                className="book-cover"
                src={book.coverimage}
                alt={`Cover of ${book.title}`}
                onError={(e) => {
                  e.currentTarget.style.background = "#d0d0c8";
                  e.currentTarget.removeAttribute("src");
                }}
              />
              <div className="book-info">
                <p className="book-title">{book.title}</p>
                <p className="book-author">{book.author}</p>
              </div>
              <span className={`badge ${book.available ? "available" : "unavailable"}`}>
                {book.available ? "Available" : "Checked Out"}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
