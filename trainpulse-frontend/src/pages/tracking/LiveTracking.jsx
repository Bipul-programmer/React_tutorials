import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import StatusBadge from "../../components/common/StatusBadge";

const TRACKING_DATA = [
  {
    trainNumber: "12301",
    name: "Howrah Rajdhani Express",
    source: "Howrah (HWH)",
    destination: "New Delhi (NDLS)",
    progress: 72,
    currentSpeed: "128 km/h",
    lastStation: "Kanpur Central (CNB)",
    nextStation: "New Delhi (NDLS)",
    etaNextStation: "10:05 (In 2h 45m)",
    distanceCovered: "1,045 km / 1,450 km",
    status: "ON-TIME",
    signalStatus: "Green Signal Clear",
    lat: "26.4499 N",
    lng: "80.3319 E"
  },
  {
    trainNumber: "20901",
    name: "Vande Bharat Express",
    source: "Mumbai Central (MMCT)",
    destination: "Gandhinagar (GNC)",
    progress: 45,
    currentSpeed: "130 km/h",
    lastStation: "Surat (ST)",
    nextStation: "Vadodara Jn (BRC)",
    etaNextStation: "10:13 (In 18m)",
    distanceCovered: "263 km / 522 km",
    status: "RUNNING",
    signalStatus: "Green Signal Clear",
    lat: "21.1702 N",
    lng: "72.8311 E"
  },
  {
    trainNumber: "12002",
    name: "Bhopal Shatabdi Express",
    source: "New Delhi (NDLS)",
    destination: "Rani Kamalapati (RKMP)",
    progress: 35,
    currentSpeed: "85 km/h",
    lastStation: "Agra Cantt (AGC)",
    nextStation: "Gwalior (GWL)",
    etaNextStation: "09:48 (+25m delay)",
    distanceCovered: "200 km / 708 km",
    status: "DELAYED",
    signalStatus: "Caution Amber (Speed 85km/h)",
    lat: "27.1767 N",
    lng: "78.0081 E"
  }
];

function LiveTracking() {
  const [searchParams] = useSearchParams();
  const defaultTrainNo = searchParams.get("train") || "12301";

  const [selectedTrain, setSelectedTrain] = useState(
    TRACKING_DATA.find(t => t.trainNumber === defaultTrainNo) || TRACKING_DATA[0]
  );

  const [simulatedProgress, setSimulatedProgress] = useState(selectedTrain.progress);

  useEffect(() => {
    setSimulatedProgress(selectedTrain.progress);
    // Realtime progress simulation pulse
    const interval = setInterval(() => {
      setSimulatedProgress(prev => (prev < 100 ? prev + 0.1 : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedTrain]);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-title">
          <h1>Live Railway GPS Tracking System</h1>
          <p>Real-time telematics, signal monitoring, and position tracking</p>
        </div>
      </div>

      {/* Train Selector Dropdown Toolbar */}
      <div className="search-toolbar">
        <div style={{ flex: 1 }}>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: '4px', fontSize: '0.85rem' }}>
            Select Monitored Train:
          </label>
          <select
            className="select-control"
            value={selectedTrain.trainNumber}
            onChange={(e) => {
              const matched = TRACKING_DATA.find(t => t.trainNumber === e.target.value);
              if (matched) setSelectedTrain(matched);
            }}
          >
            {TRACKING_DATA.map((t) => (
              <option key={t.trainNumber} value={t.trainNumber}>
                {t.trainNumber} - {t.name} ({t.source} → {t.destination})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tracking Radar Dashboard */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <span style={{ color: '#60a5fa', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.2rem' }}>
              📡 LIVE SATELLITE TELEMETRY
            </span>
            <h2 style={{ color: 'white', fontSize: '1.8rem', fontWeight: 700, margin: '6px 0' }}>
              {selectedTrain.trainNumber} - {selectedTrain.name}
            </h2>
            <p style={{ color: '#94a3b8' }}>
              Route: <strong>{selectedTrain.source}</strong> ➔ <strong>{selectedTrain.destination}</strong>
            </p>
          </div>
          <div>
            <StatusBadge status={selectedTrain.status} />
          </div>
        </div>

        {/* Live Progress Bar Simulation */}
        <div style={{ marginTop: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '8px' }}>
            <span>{selectedTrain.source} (Start)</span>
            <span style={{ fontWeight: 700, color: '#60a5fa' }}>Current Location: {selectedTrain.lastStation} ({Math.round(simulatedProgress)}%)</span>
            <span>{selectedTrain.destination} (End)</span>
          </div>

          <div style={{ height: '14px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '7px', overflow: 'hidden', position: 'relative' }}>
            <div
              style={{
                height: '100%',
                width: `${simulatedProgress}%`,
                backgroundColor: selectedTrain.status === "DELAYED" ? "#f87171" : "#3b82f6",
                transition: 'width 1s ease-in-out'
              }}
            ></div>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>GPS Speed Gauge</span>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4ade80' }}>{selectedTrain.currentSpeed}</p>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Next Station</span>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>{selectedTrain.nextStation}</p>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>ETA Next Station</span>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#facc15' }}>{selectedTrain.etaNextStation}</p>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Signal Status</span>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#60a5fa' }}>{selectedTrain.signalStatus}</p>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>GPS Coordinates</span>
            <p style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: '#cbd5e1' }}>
              {selectedTrain.lat}, {selectedTrain.lng}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveTracking;
