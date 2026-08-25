import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getStationById } from "../../services/stationService";
import StatusBadge from "../../components/common/StatusBadge";

function StationDetails() {
  const { id } = useParams();
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeBoard, setActiveBoard] = useState("arrivals");

  useEffect(() => {
    const fetchStation = async () => {
      try {
        setLoading(true);
        const res = await getStationById(id);
        setStation(res.data);
      } catch (err) {
        console.error("Error loading station details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStation();
  }, [id]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading station information...</div>;
  }
  if (!station) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Station not found</h2>
        <Link to="/stations" className="btn btn-primary" style={{ marginTop: '16px' }}>Back to Stations</Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Link to="/stations" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}>
          ← Back to Stations Directory
        </Link>
      </div>

      {/* Station Banner Header */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#60a5fa' }}>
                {station.code}
              </span>
              <StatusBadge status={station.status} />
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                {station.category}
              </span>
            </div>
            <h1 style={{ color: 'white', fontSize: '1.6rem', fontWeight: 700, margin: '8px 0' }}>
              {station.name}
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              City: <strong>{station.city}</strong> | Zone: <strong>{station.zone}</strong>
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Daily Passenger Footfall</span>
            <p style={{ fontSize: '1.3rem', fontWeight: 700, color: 'white' }}>{station.dailyPassengerCount}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Platforms</span>
            <p style={{ fontWeight: 600, color: 'white', fontSize: '1.1rem' }}>{station.platforms} Active</p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Control Helpline</span>
            <p style={{ fontWeight: 600, color: '#4ade80', fontSize: '0.95rem' }}>{station.contactNumber}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Station Category</span>
            <p style={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>{station.category}</p>
          </div>
        </div>
      </div>

      {/* Live Arrivals / Departures Digital Display Board */}
      <div className="card">
        <div className="card-title">
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className={`btn ${activeBoard === "arrivals" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setActiveBoard("arrivals")}
            >
              📥 Live Arrivals Board
            </button>
            <button
              className={`btn ${activeBoard === "departures" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setActiveBoard("departures")}
            >
              📤 Live Departures Board
            </button>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Live Platform Feed</span>
        </div>

        <div className="table-container" style={{ margin: 0, boxShadow: 'none', border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Train No.</th>
                <th>Train Name</th>
                <th>Scheduled Time</th>
                <th>Platform</th>
                <th>Expected Status</th>
              </tr>
            </thead>
            <tbody>
              {(activeBoard === "arrivals" ? station.upcomingArrivals : station.upcomingDepartures)?.map((tr, idx) => (
                <tr key={idx}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary-blue)' }}>
                    {tr.trainNumber}
                  </td>
                  <td style={{ fontWeight: 600 }}>{tr.trainName}</td>
                  <td style={{ fontWeight: 600 }}>{tr.time}</td>
                  <td>
                    <span style={{ background: 'var(--primary-navy)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '0.8rem' }}>
                      {tr.platform}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={tr.status} />
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                    No upcoming trains listed on board right now.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Station Amenities Grid */}
      <div className="card">
        <div className="card-title">
          <span>Station Amenities & Passenger Facilities</span>
          <span>🏛️</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {station.amenities?.map((amenity, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>✔️</span> {amenity}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StationDetails;