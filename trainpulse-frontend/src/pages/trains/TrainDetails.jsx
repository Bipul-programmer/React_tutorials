import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTrainById, updateTrain } from "../../services/trainService";
import StatusBadge from "../../components/common/StatusBadge";
import { useAuth } from "../../context/AuthContext";

function TrainDetails() {
  const { id } = useParams();
  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModal, setIsEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  const { isAdmin } = useAuth();

  const fetchTrainDetails = async () => {
    try {
      setLoading(true);
      const response = await getTrainById(id);
      setTrain(response.data);
      setEditFormData(response.data);
    } catch (error) {
      console.error("Error loading train details", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainDetails();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateTrain(id, editFormData);
    setTrain(editFormData);
    setIsEditModal(false);
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading train details...</div>;
  }
  if (!train) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Train not found</h2>
        <Link to="/trains" className="btn btn-primary" style={{ marginTop: '16px' }}>Back to Trains</Link>
      </div>
    );
  }

  // Coach composition mapping
  const coachTypes = ["ENG", "H1", "A1", "A2", "B1", "B2", "B3", "B4", "PC", "S1", "S2", "S3", "EOG"];

  return (
    <div>
      {/* Back button & Page title */}
      <div style={{ marginBottom: '16px' }}>
        <Link to="/trains" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}>
          ← Back to Trains Directory
        </Link>
      </div>

      {/* Train Profile Header Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#60a5fa' }}>
                {train.trainNumber}
              </span>
              <StatusBadge status={train.status} />
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                {train.type}
              </span>
            </div>
            <h1 style={{ color: 'white', fontSize: '1.6rem', fontWeight: 700, margin: '8px 0' }}>
              {train.name}
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Route: <strong>{train.source}</strong> ➔ <strong>{train.destination}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {isAdmin && (
              <button onClick={() => setIsEditModal(true)} className="btn btn-secondary" style={{ backgroundColor: 'white', color: '#0f172a' }}>
                ✏️ Edit Status
              </button>
            )}
            <Link to={`/tracking?train=${train.trainNumber}`} className="btn btn-primary" style={{ backgroundColor: '#2563eb' }}>
              📡 Live GPS Track
            </Link>
          </div>
        </div>

        {/* Quick Stat Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Current Position</span>
            <p style={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>{train.currentStation || train.source}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Current Speed</span>
            <p style={{ fontWeight: 600, color: '#4ade80', fontSize: '0.95rem' }}>{train.speed || "110 km/h"}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Delay Status</span>
            <p style={{ fontWeight: 600, color: train.delayMinutes > 0 ? '#f87171' : '#4ade80', fontSize: '0.95rem' }}>
              {train.delayMinutes ? `+${train.delayMinutes} mins` : "On-Time (0 min)"}
            </p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Total Coaches</span>
            <p style={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>{train.totalCoaches || 22} Coaches</p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Seat Occupancy</span>
            <p style={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>{train.occupancy || "96%"}</p>
          </div>
        </div>
      </div>

      {/* Grid: Route Schedule Timeline & Coach Composition */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Route Station Schedule */}
        <div className="card">
          <div className="card-title">
            <span>Route Schedule & Station Timings</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Updated 2 mins ago</span>
          </div>

          <div className="timeline">
            {(train.route || [
              { station: train.source, code: "SRC", arrival: "--", departure: train.departureTime, day: 1, status: "DEPARTED" },
              { station: train.currentStation || "En-Route Hub", code: "HUB", arrival: "04:30", departure: "04:35", day: 1, status: "AT STATION" },
              { station: train.destination, code: "DST", arrival: train.arrivalTime, departure: "--", day: 2, status: "SCHEDULED" }
            ]).map((node, index) => {
              const isPassed = node.status === "DEPARTED" || node.status === "AT STATION";
              return (
                <div key={index} className={`timeline-item ${isPassed ? "passed" : ""}`}>
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="timeline-title">
                        {node.station} ({node.code})
                      </div>
                      <StatusBadge status={node.status || "SCHEDULED"} />
                    </div>
                    <div className="timeline-time">
                      Arr: <strong>{node.arrival}</strong> | Dep: <strong>{node.departure}</strong> | Day {node.day || 1}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coach Composition Layout */}
        <div>
          <div className="card">
            <div className="card-title">
              <span>Coach Composition</span>
              <span>🚂</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Standard LHB Rake Layout (Front to Rear):
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {coachTypes.map((c, i) => (
                <div
                  key={i}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    backgroundColor: c === "ENG" ? "#0f172a" : c === "PC" ? "#b45309" : "var(--accent-blue)",
                    color: "white",
                    textAlign: "center",
                    minWidth: '40px'
                  }}
                >
                  {c}
                </div>
              ))}
            </div>
            <div style={{ marginTop: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <span>⬛ ENG: Engine</span>
              <span>🟦 A/B: AC Coaches</span>
              <span>🟨 PC: Pantry</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Train Modal */}
      {isEditModal && editFormData && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '480px', margin: 0 }}>
            <div className="card-title">
              <span>Update Train Status</span>
              <button onClick={() => setIsEditModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Operational Status</label>
                <select
                  className="select-control"
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                >
                  <option value="ON-TIME">ON-TIME</option>
                  <option value="RUNNING">RUNNING</option>
                  <option value="DELAYED">DELAYED</option>
                  <option value="SCHEDULED">SCHEDULED</option>
                </select>
              </div>

              <div className="form-group">
                <label>Delay Minutes</label>
                <input
                  type="number"
                  className="input-control"
                  value={editFormData.delayMinutes || 0}
                  onChange={(e) => setEditFormData({ ...editFormData, delayMinutes: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="form-group">
                <label>Current Location / Station</label>
                <input
                  type="text"
                  className="input-control"
                  value={editFormData.currentStation || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, currentStation: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Current Speed</label>
                <input
                  type="text"
                  className="input-control"
                  value={editFormData.speed || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, speed: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsEditModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainDetails;
