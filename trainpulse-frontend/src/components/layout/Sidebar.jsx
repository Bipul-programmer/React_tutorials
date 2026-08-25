import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Railway Ops</h2>
        <p>Control & Logistics System</p>
      </div>

      <nav className="sidebar-nav">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
        >
          📊 Dashboard
        </NavLink>

        <NavLink 
          to="/trains" 
          className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
        >
          🚆 Trains Directory
        </NavLink>

        <NavLink 
          to="/stations" 
          className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
        >
          🚉 Stations Directory
        </NavLink>

        <NavLink 
          to="/routes" 
          className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
        >
          🗺️ Route Finder
        </NavLink>

        <NavLink 
          to="/tracking" 
          className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
        >
          📡 Live Tracking
        </NavLink>

        <NavLink 
          to="/notifications" 
          className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
        >
          🔔 Operational Alerts
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <p>System Status: 🟢 Operational</p>
        <p style={{ marginTop: '4px' }}>TrainPulse v2.4 Enterprise</p>
      </div>
    </aside>
  );
}

export default Sidebar;