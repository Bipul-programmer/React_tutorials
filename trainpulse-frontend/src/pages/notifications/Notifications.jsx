import { useState } from "react";
import StatusBadge from "../../components/common/StatusBadge";
import { useAuth } from "../../context/AuthContext";

const INITIAL_BULLETINS = [
  {
    id: "bl-001",
    title: "Dense Fog Alert & Speed Restrictions",
    category: "Weather",
    severity: "HIGH",
    timestamp: "2026-08-25 21:30",
    section: "Northern Railway (NR) - Kanpur to DDU Section",
    description: "Maximum permissible speed restricted to 60 km/h due to heavy fog visibility under 100 meters. Expect delays up to 30 mins on Rajdhani and Shatabdi routes."
  },
  {
    id: "bl-002",
    title: "Platform Maintenance at New Delhi (NDLS)",
    category: "Infrastructure",
    severity: "MEDIUM",
    timestamp: "2026-08-25 18:00",
    section: "Platform 4 & 5",
    description: "Interlocking upgrade work in progress. Incoming trains diverted to Platforms 8 and 10."
  },
  {
    id: "bl-003",
    title: "High-Speed Trial Pass on Vande Bharat Corridor",
    category: "Operational",
    severity: "LOW",
    timestamp: "2026-08-25 14:15",
    section: "Mumbai - Ahmedabad High Speed Line",
    description: "Trial pass successfully conducted with 130 km/h speed rating. All track parameters normal."
  }
];

function Notifications() {
  const [bulletins, setBulletins] = useState(INITIAL_BULLETINS);
  const [filterCategory, setFilterCategory] = useState("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: "",
    category: "Weather",
    severity: "MEDIUM",
    section: "",
    description: ""
  });

  const { isAdmin } = useAuth();

  const handleCreateNotice = (e) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.description) return;
    
    const created = {
      id: `bl-${Date.now()}`,
      ...newNotice,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
    };
    setBulletins([created, ...bulletins]);
    setIsModalOpen(false);
    setNewNotice({ title: "", category: "Weather", severity: "MEDIUM", section: "", description: "" });
  };

  const filteredBulletins = bulletins.filter(b => 
    filterCategory === "ALL" || b.category.toLowerCase() === filterCategory.toLowerCase()
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-header-title">
          <h1>Operational Alerts & Advisories</h1>
          <p>Official railway system bulletins, weather warnings, and maintenance notices</p>
        </div>
        <div>
          {isAdmin && (
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
              + Issue New Bulletin
            </button>
          )}
        </div>
      </div>

      {/* Filter Category Toolbar */}
      <div className="search-toolbar">
        <div className="search-field">
          <select
            className="select-control"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            <option value="Weather">Weather Warnings</option>
            <option value="Infrastructure">Track & Platform Infrastructure</option>
            <option value="Operational">Operational Notices</option>
          </select>
        </div>
      </div>

      {/* Bulletins List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredBulletins.map((b) => (
          <div key={b.id} className="card" style={{ borderLeft: `4px solid ${b.severity === "HIGH" ? "#b91c1c" : b.severity === "MEDIUM" ? "#b45309" : "#2563eb"}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', textTransform: 'uppercase' }}>
                  {b.category}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '8px 0 4px 0', color: 'var(--text-heading)' }}>
                  {b.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Section: <strong>{b.section}</strong> | Issued: {b.timestamp}
                </p>
              </div>

              <div>
                <StatusBadge status={b.severity === "HIGH" ? "DELAYED" : b.severity === "MEDIUM" ? "RUNNING" : "ON-TIME"} />
              </div>
            </div>

            <p style={{ marginTop: '12px', fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-main)' }}>
              {b.description}
            </p>
          </div>
        ))}
      </div>

      {/* New Bulletin Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '480px', margin: 0 }}>
            <div className="card-title">
              <span>Issue Railway Operational Bulletin</span>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleCreateNotice}>
              <div className="form-group">
                <label>Bulletin Title *</label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. Signal Failure at Junction"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="select-control"
                    value={newNotice.category}
                    onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                  >
                    <option value="Weather">Weather</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Operational">Operational</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Severity Level</label>
                  <select
                    className="select-control"
                    value={newNotice.severity}
                    onChange={(e) => setNewNotice({ ...newNotice, severity: e.target.value })}
                  >
                    <option value="HIGH">High Alert</option>
                    <option value="MEDIUM">Medium Warning</option>
                    <option value="LOW">Low Advisory</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Affected Section / Zone</label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. Kanpur - DDU Section"
                  value={newNotice.section}
                  onChange={(e) => setNewNotice({ ...newNotice, section: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Detailed Description *</label>
                <textarea
                  className="input-control"
                  rows="3"
                  placeholder="Enter details..."
                  value={newNotice.description}
                  onChange={(e) => setNewNotice({ ...newNotice, description: e.target.value })}
                  required
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Bulletin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;
