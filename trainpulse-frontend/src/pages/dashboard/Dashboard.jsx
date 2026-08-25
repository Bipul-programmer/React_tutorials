import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllTrains } from "../../services/trainService";
import StatusBadge from "../../components/common/StatusBadge";

function Dashboard() {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await getAllTrains();
        setTrains(res.data || []);
      } catch (err) {
        console.error("Dashboard error fetching trains", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const totalTrains = trains.length;
  const runningCount = trains.filter(t => t.status === "RUNNING" || t.status === "ON-TIME").length;
  const delayedCount = trains.filter(t => t.status === "DELAYED" || (t.delayMinutes && t.delayMinutes > 0)).length;
  const onTimePercentage = totalTrains ? Math.round(((totalTrains - delayedCount) / totalTrains) * 100) : 100;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-title">
          <h1>Railway Control Dashboard</h1>
          <p>Real-time operational status, traffic metrics & train movement overview</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/trains" className="btn btn-primary">
            + Manage Trains
          </Link>
          <Link to="/notifications" className="btn btn-secondary">
            🔔 Issue Alert
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="dashboard-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span>Total Trains</span>
            <span>🚆</span>
          </div>
          <div className="metric-value">{totalTrains}</div>
          <div className="metric-footer">Scheduled in active roster</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Active / Running</span>
            <span>🟢</span>
          </div>
          <div className="metric-value" style={{ color: '#15803d' }}>{runningCount}</div>
          <div className="metric-footer">Currently on track</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Delayed Trains</span>
            <span>⚠️</span>
          </div>
          <div className="metric-value" style={{ color: '#b91c1c' }}>{delayedCount}</div>
          <div className="metric-footer">Punctuality impact</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>On-Time Rate</span>
            <span>📊</span>
          </div>
          <div className="metric-value">{onTimePercentage}%</div>
          <div className="metric-footer">National benchmark: 90%</div>
        </div>
      </div>

      {/* Main Grid Section: Table + Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '24px' }}>
        {/* Table Container */}
        <div>
          <div className="card-title">
            <span>Live Active Trains Status</span>
            <Link to="/trains" style={{ fontSize: '0.85rem', color: 'var(--accent-blue)' }}>View All Trains →</Link>
          </div>

          <div className="table-container">
            {loading ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading live dashboard data...</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Train No.</th>
                    <th>Train Name</th>
                    <th>Route</th>
                    <th>Current Station</th>
                    <th>Status</th>
                    <th>Delay</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {trains.map((train) => (
                    <tr key={train.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{train.trainNumber}</td>
                      <td style={{ fontWeight: 600 }}>{train.name}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {train.source} → {train.destination}
                      </td>
                      <td>{train.currentStation || train.source}</td>
                      <td>
                        <StatusBadge status={train.status} />
                      </td>
                      <td style={{ fontWeight: 600, color: train.delayMinutes > 0 ? '#b91c1c' : '#15803d' }}>
                        {train.delayMinutes ? `+${train.delayMinutes} min` : "On-Time"}
                      </td>
                      <td>
                        <Link to={`/trains/${train.id}`} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Operational Alerts Radar Sidebar */}
        <div>
          <div className="card">
            <div className="card-title">
              <span>Operational Bulletins</span>
              <span>📢</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ borderLeft: '3px solid #b91c1c', paddingLeft: '10px' }}>
                <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>Weather Alert: Heavy Rain</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Speed restriction 60km/h on Kanpur - DDU section.
                </p>
              </div>

              <div style={{ borderLeft: '3px solid #b45309', paddingLeft: '10px' }}>
                <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>Track Maintenance</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Platform 4 closed at New Delhi (NDLS) till 16:00.
                </p>
              </div>

              <div style={{ borderLeft: '3px solid #15803d', paddingLeft: '10px' }}>
                <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>New High-Speed Corridor</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Vande Bharat 20901 operating with 100% capacity.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <Link to="/notifications" className="btn btn-outline" style={{ width: '100%', fontSize: '0.8rem', textAlign: 'center' }}>
                View All Bulletins
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;