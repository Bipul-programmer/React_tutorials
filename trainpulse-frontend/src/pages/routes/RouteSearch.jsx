import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { searchRoutes } from "../../services/routeService";

function RouteSearch() {
  const [searchParams] = useSearchParams();
  const initialFrom = searchParams.get("from") || "";
  const initialTo = searchParams.get("to") || "";

  const [fromStation, setFromStation] = useState(initialFrom);
  const [toStation, setToStation] = useState(initialTo);
  const [travelDate, setTravelDate] = useState(new Date().toISOString().split("T")[0]);
  
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFareTrain, setSelectedFareTrain] = useState(null);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await searchRoutes(fromStation, toStation, travelDate);
      setRoutes(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-title">
          <h1>Route Finder & Timetables</h1>
          <p>Find direct and connecting trains between stations with seat availability & fares</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card">
        <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Origin Station (From)</label>
            <input
              type="text"
              className="input-control"
              placeholder="e.g. HWH or Howrah"
              value={fromStation}
              onChange={(e) => setFromStation(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Destination Station (To)</label>
            <input
              type="text"
              className="input-control"
              placeholder="e.g. NDLS or New Delhi"
              value={toStation}
              onChange={(e) => setToStation(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Date of Travel</label>
            <input
              type="date"
              className="input-control"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
            />
          </div>

          <div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
              Search Route Timetable
            </button>
          </div>
        </form>
      </div>

      {/* Results Table */}
      <div className="table-container">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Searching available train schedules...</div>
        ) : routes.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No direct train routes found for selected query. Try clearing origin/destination.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Train Info</th>
                <th>Origin (Dep)</th>
                <th>Destination (Arr)</th>
                <th>Duration</th>
                <th>Frequency</th>
                <th>Available Classes & Fare</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((rt) => (
                <tr key={rt.id}>
                  <td>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary-blue)' }}>
                      {rt.trainNumber}
                    </div>
                    <div style={{ fontWeight: 600 }}>{rt.trainName}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{rt.fromStation}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dep: {rt.departure}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{rt.toStation}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Arr: {rt.arrival}</div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{rt.duration}</td>
                  <td style={{ fontSize: '0.85rem' }}>{rt.frequency}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {rt.availableClasses?.map((c, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedFareTrain({ train: rt, classInfo: c })}
                          style={{
                            padding: '4px 8px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            backgroundColor: 'var(--bg-main)',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          <strong>{c.classCode}</strong>: {c.fare} ({c.seats} seats)
                        </button>
                      ))}
                    </div>
                  </td>
                  <td>
                    <Link to={`/trains/${rt.trainNumber}`} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                      Schedule Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Fare Booking Simulation Modal */}
      {selectedFareTrain && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '420px', margin: 0 }}>
            <div className="card-title">
              <span>Fare Breakdown & Seat Availability</span>
              <button onClick={() => setSelectedFareTrain(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p>Train: <strong>{selectedFareTrain.train.trainNumber} - {selectedFareTrain.train.trainName}</strong></p>
              <p>Class: <strong>{selectedFareTrain.classInfo.name} ({selectedFareTrain.classInfo.classCode})</strong></p>
              <p>Fare per passenger: <strong style={{ color: 'var(--primary-blue)', fontSize: '1.1rem' }}>{selectedFareTrain.classInfo.fare}</strong></p>
              <p>Status: <span style={{ color: '#15803d', fontWeight: 600 }}>AVAILABLE ({selectedFareTrain.classInfo.seats} Seats)</span></p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button onClick={() => setSelectedFareTrain(null)} className="btn btn-secondary">Close</button>
              <button onClick={() => { alert("Redirecting to Indian Railways IRCTC Booking Portal..."); setSelectedFareTrain(null); }} className="btn btn-primary">
                Proceed to Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RouteSearch;
