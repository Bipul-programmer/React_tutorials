import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getAllTrains, createTrain } from "../../services/trainService";
import StatusBadge from "../../components/common/StatusBadge";
import { useAuth } from "../../context/AuthContext";

function TrainList() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  // Modal State for adding a train
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTrainData, setNewTrainData] = useState({
    trainNumber: "",
    name: "",
    source: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
    type: "Express",
    totalCoaches: 20
  });

  const { isAdmin } = useAuth();

  const fetchTrains = async () => {
    try {
      setLoading(true);
      const response = await getAllTrains();
      setTrains(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load trains directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newTrainData.trainNumber || !newTrainData.name) {
      alert("Please fill in train number and train name.");
      return;
    }
    await createTrain(newTrainData);
    setIsModalOpen(false);
    setNewTrainData({
      trainNumber: "",
      name: "",
      source: "",
      destination: "",
      departureTime: "",
      arrivalTime: "",
      type: "Express",
      totalCoaches: 20
    });
    fetchTrains();
  };

  // Filtered train dataset
  const filteredTrains = trains.filter(t => {
    const matchesSearch = 
      t.trainNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.destination.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || t.status.toUpperCase() === statusFilter;
    const matchesType = typeFilter === "ALL" || t.type.toLowerCase().includes(typeFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-header-title">
          <h1>Trains Directory</h1>
          <p>Search, monitor and manage railway schedule rosters</p>
        </div>
        <div>
          {isAdmin && (
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
              + Add New Train
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="search-toolbar">
        <div className="search-field" style={{ flex: 2 }}>
          <input
            type="text"
            className="input-control"
            placeholder="Search by Train Number, Name, Source or Destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="search-field">
          <select
            className="select-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="ON-TIME">ON-TIME</option>
            <option value="RUNNING">RUNNING</option>
            <option value="DELAYED">DELAYED</option>
            <option value="SCHEDULED">SCHEDULED</option>
          </select>
        </div>

        <div className="search-field">
          <select
            className="select-control"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="ALL">All Train Types</option>
            <option value="Rajdhani">Rajdhani / Superfast</option>
            <option value="Vande Bharat">Vande Bharat</option>
            <option value="Shatabdi">Shatabdi</option>
            <option value="Duronto">Duronto Express</option>
            <option value="Express">Express</option>
          </select>
        </div>
      </div>

      {/* Main Trains Table */}
      <div className="table-container">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading trains directory...</div>
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--status-delayed-text)' }}>{error}</div>
        ) : filteredTrains.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No trains found matching your search parameters.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Train No.</th>
                <th>Train Name</th>
                <th>Category</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Dep. / Arr.</th>
                <th>Status</th>
                <th>Delay</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrains.map((train) => (
                <tr key={train.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary-blue)' }}>
                    {train.trainNumber}
                  </td>
                  <td style={{ fontWeight: 600 }}>{train.name}</td>
                  <td>
                    <span style={{ fontSize: '0.75rem', background: 'var(--bg-main)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                      {train.type}
                    </span>
                  </td>
                  <td>{train.source}</td>
                  <td>{train.destination}</td>
                  <td style={{ fontSize: '0.85rem' }}>
                    {train.departureTime} → {train.arrivalTime}
                  </td>
                  <td>
                    <StatusBadge status={train.status} />
                  </td>
                  <td style={{ fontWeight: 600, color: train.delayMinutes > 0 ? '#b91c1c' : '#15803d' }}>
                    {train.delayMinutes ? `+${train.delayMinutes} m` : "0 m"}
                  </td>
                  <td>
                    <Link to={`/trains/${train.id}`} className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Train Modal Dialog */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '500px', maxWidth: '90%', margin: 0 }}>
            <div className="card-title">
              <span>Add New Train Schedule</span>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleCreateSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Train Number *</label>
                  <input
                    type="text"
                    className="input-control"
                    placeholder="e.g. 12951"
                    value={newTrainData.trainNumber}
                    onChange={(e) => setNewTrainData({ ...newTrainData, trainNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Train Name *</label>
                  <input
                    type="text"
                    className="input-control"
                    placeholder="e.g. Mumbai Rajdhani"
                    value={newTrainData.name}
                    onChange={(e) => setNewTrainData({ ...newTrainData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Source Station</label>
                  <input
                    type="text"
                    className="input-control"
                    placeholder="e.g. Mumbai Central"
                    value={newTrainData.source}
                    onChange={(e) => setNewTrainData({ ...newTrainData, source: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Destination Station</label>
                  <input
                    type="text"
                    className="input-control"
                    placeholder="e.g. New Delhi"
                    value={newTrainData.destination}
                    onChange={(e) => setNewTrainData({ ...newTrainData, destination: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Departure Time</label>
                  <input
                    type="text"
                    className="input-control"
                    placeholder="17:00"
                    value={newTrainData.departureTime}
                    onChange={(e) => setNewTrainData({ ...newTrainData, departureTime: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Arrival Time</label>
                  <input
                    type="text"
                    className="input-control"
                    placeholder="08:32 (+1)"
                    value={newTrainData.arrivalTime}
                    onChange={(e) => setNewTrainData({ ...newTrainData, arrivalTime: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Train
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainList;
