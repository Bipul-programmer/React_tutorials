import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Home() {
  const [trainQuery, setTrainQuery] = useState("");
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const navigate = useNavigate();

  const handleTrainSearch = (e) => {
    e.preventDefault();
    if (trainQuery.trim()) {
      navigate(`/trains?search=${encodeURIComponent(trainQuery.trim())}`);
    }
  };

  const handleRouteSearch = (e) => {
    e.preventDefault();
    if (fromStation || toStation) {
      navigate(`/routes?from=${encodeURIComponent(fromStation)}&to=${encodeURIComponent(toStation)}`);
    } else {
      navigate("/routes");
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="card" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)', color: 'white', padding: '36px', borderRadius: '12px' }}>
        <div style={{ maxWidth: '800px' }}>
          <span className="brand-badge" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', marginBottom: '12px', display: 'inline-block' }}>
            NATIONAL RAILWAY CONTROL & INFORMATION SYSTEM
          </span>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: 700, margin: '12px 0 8px 0', letterSpacing: '-0.5px' }}>
            TrainPulse Railway Operations & Tracking Portal
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1rem', marginBottom: '24px', lineHeight: '1.6' }}>
            Real-time tracking, train schedules, station operational management, and arrival/departure updates across the national railway network.
          </p>

          {/* Quick Route Search Form inside Hero */}
          <form onSubmit={handleRouteSearch} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', backgroundColor: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '8px', backdropFilter: 'blur(4px)' }}>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <input
                type="text"
                className="input-control"
                placeholder="From Station (e.g., NDLS or New Delhi)"
                value={fromStation}
                onChange={(e) => setFromStation(e.target.value)}
                style={{ backgroundColor: 'white', color: '#0f172a' }}
              />
            </div>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <input
                type="text"
                className="input-control"
                placeholder="To Station (e.g., HWH or Howrah)"
                value={toStation}
                onChange={(e) => setToStation(e.target.value)}
                style={{ backgroundColor: 'white', color: '#0f172a' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#2563eb', padding: '10px 24px' }}>
              Find Trains
            </button>
          </form>
        </div>
      </section>

      {/* System Metrics Strip */}
      <div className="dashboard-grid" style={{ marginTop: '24px' }}>
        <div className="metric-card">
          <div className="metric-header">
            <span>Total Active Trains</span>
            <span>🚆</span>
          </div>
          <div className="metric-value">1,420</div>
          <div className="metric-footer">Monitored across 16 Railway Zones</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Network Punctuality</span>
            <span>⏱️</span>
          </div>
          <div className="metric-value" style={{ color: '#15803d' }}>94.2%</div>
          <div className="metric-footer">+1.8% compared to last week</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Operational Stations</span>
            <span>🚉</span>
          </div>
          <div className="metric-value">7,325</div>
          <div className="metric-footer">Includes 500+ Category A1 Hubs</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Daily Passengers</span>
            <span>👥</span>
          </div>
          <div className="metric-value">23.5 M</div>
          <div className="metric-footer">Active passenger traffic</div>
        </div>
      </div>

      {/* Train Quick Lookup & Features Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginTop: '12px' }}>
        {/* Quick Search Card */}
        <div className="card">
          <div className="card-title">
            <span>Quick Train Search</span>
            <span>🔍</span>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.85rem' }}>
            Enter a 5-digit train number or train name to view live status, station arrival times, and coach layout.
          </p>
          <form onSubmit={handleTrainSearch} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              className="input-control"
              placeholder="e.g. 12301 or Rajdhani"
              value={trainQuery}
              onChange={(e) => setTrainQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>

        {/* Live System Navigation */}
        <div className="card">
          <div className="card-title">
            <span>System Quick Access</span>
            <span>⚡</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Link to="/tracking" className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '12px' }}>
              📡 Live Tracking
            </Link>
            <Link to="/trains" className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '12px' }}>
              🚆 Trains Directory
            </Link>
            <Link to="/stations" className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '12px' }}>
              🚉 Station Directory
            </Link>
            <Link to="/notifications" className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '12px' }}>
              🔔 Operational Alerts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;