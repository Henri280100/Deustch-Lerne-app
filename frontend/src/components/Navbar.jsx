import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <svg className="brand-mark" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="7" cy="17" r="4.5" fill="var(--gold)" />
            <rect x="12.5" y="4.5" width="7.5" height="7.5" fill="var(--slate)" />
            <polygon points="17,13 21,20 13,20" fill="var(--red)" />
          </svg>
          Deutsch Pfad
        </Link>
        <nav className="nav-links">
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <span>{user.name}</span>
              <button
                className="btn-text"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register" className="btn btn-gold">
                Start learning
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
