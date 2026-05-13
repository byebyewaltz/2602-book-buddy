import { Link, useNavigate, useLocation } from "react-router-dom";

export default function NavBar({ token, setToken }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/books");
  }

  return (
    <nav className="navbar">
      <Link to="/books" className="nav-brand">📚 BookBuddy</Link>

      <div className="nav-links">
        {/* Exact match — should NOT stay active on /books/123 */}
        <Link
          to="/books"
          className={pathname === "/books" ? "nav-link-active" : ""}
        >
          Catalog
        </Link>
        {token ? (
          <>
            <Link
              to="/account"
              className={pathname === "/account" ? "nav-link-active" : ""}
            >
              My Account
            </Link>
            <button type="button" className="btn btn-outline" onClick={handleLogout}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={pathname === "/login" ? "nav-link-active" : ""}
            >
              Log In
            </Link>
            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
