import { Link, useNavigate, useLocation } from "react-router-dom";

export default function NavBar({ token, setToken }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/books");
  }

  const isActive = (path) => pathname === path || pathname.startsWith(path + "/");

  return (
    <nav className="navbar">
      {/* Center: site title */}
      <Link to="/books" className="nav-brand">📚 BookBuddy</Link>

      {/* Right: nav links */}
      <div className="nav-links">
        <Link to="/books" className={isActive("/books") ? "nav-link-active" : ""}>
          Catalog
        </Link>

        {token ? (
          <>
            <Link to="/account" className={isActive("/account") ? "nav-link-active" : ""}>
              My Account
            </Link>
            <button className="btn btn-outline" onClick={handleLogout}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={isActive("/login") ? "nav-link-active" : ""}>
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
