import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllStations } from "../../services/stationService";
import StatusBadge from "../../components/common/StatusBadge";

function StationList() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [zoneFilter, setZoneFilter] = useState("ALL");

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        const res = await getAllStations();
        setStations(res.data || []);
      } catch (err) {
        console.error("Error fetching stations", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, []);

  const filteredStations = stations.filter(st => {
    const matchesSearch = 
      st.name.toLowerCase().includes(search.toLowerCase()) ||
      st.code.toLowerCase().includes(search.toLowerCase()) ||
      st.city.toLowerCase().includes(search.toLowerCase());

    const matchesZone = zoneFilter === "ALL" || st.zone.includes(zoneFilter);
    return matchesSearch && matchesZone;
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-header-title">
          <h1>Railway Stations Directory</h1>
          <p>Network terminal stations, platforms, and operational status</p>
        </div>
      </div>

      {/* Toolbar Search & Filter */}
      <div className="search-toolbar">
        <div className="search-field" style={{ flex: 2 }}>
          <input
            type="text"
            className="input-control"
            placeholder="Search by Station Name, Station Code (e.g. NDLS) or City..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="search-field">
          <select
            className="select-control"
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
          >
            <option value="ALL">All Railway Zones</option>
            <option value="Northern">Northern Railway (NR)</option>
            <option value="Eastern">Eastern Railway (ER)</option>
            <option value="Central">Central Railway (CR)</option>
            <option value="North Central">North Central (NCR)</option>
            <option value="South Western">South Western (SWR)</option>
          </select>
        </div>
      </div>

      {/* Station Table */}
      <div className="table-container">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading stations directory...</div>
        ) : filteredStations.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No railway stations found matching parameters.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Station Name</th>
                <th>City</th>
                <th>Zone</th>
                <th>Platforms</th>
                <th>Category</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStations.map((st) => (
                <tr key={st.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary-blue)' }}>
                    {st.code}
                  </td>
                  <td style={{ fontWeight: 600 }}>{st.name}</td>
                  <td>{st.city}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{st.zone}</td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{st.platforms}</td>
                  <td style={{ fontSize: '0.8rem' }}>{st.category}</td>
                  <td>
                    <StatusBadge status={st.status} />
                  </td>
                  <td>
                    <Link to={`/stations/${st.id}`} className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
                      View Boards
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default StationList;
