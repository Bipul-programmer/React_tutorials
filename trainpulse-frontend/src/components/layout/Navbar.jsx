import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("trainpulse_theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("trainpulse_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>TrainPulse</span>
          <span className="brand-badge">Enterprise</span>
        </Link>
      </div>

      <div className="navbar-links">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          Home
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          Dashboard
        </NavLink>
        <NavLink to="/trains" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          Trains
        </NavLink>
        <NavLink to="/stations" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          Stations
        </NavLink>
        <NavLink to="/routes" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          Route Finder
        </NavLink>
        <NavLink to="/tracking" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          Live Tracking
        </NavLink>

        <button 
          onClick={toggleTheme} 
          className="btn btn-secondary" 
          style={{ padding: '4px 10px', fontSize: '0.8rem' }}
          title="Toggle Theme"
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        {isAuthenticated && user ? (
          <div className="user-profile-badge">
            <span style={{ fontWeight: 600 }}>{user.name}</span>
            <span className="user-role-tag">{user.role}</span>
            <button onClick={handleLogout} className="btn-logout" title="Sign Out">
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;