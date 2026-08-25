function StatusBadge({ status }) {
  const normStatus = (status || "SCHEDULED").toUpperCase().replace(/ /g, "-");

  let badgeClass = "scheduled";
  if (normStatus.includes("ON-TIME") || normStatus.includes("OPERATIONAL")) {
    badgeClass = "ontime";
  } else if (normStatus.includes("DELAYED")) {
    badgeClass = "delayed";
  } else if (normStatus.includes("RUNNING") || normStatus.includes("AT-STATION")) {
    badgeClass = "running";
  } else if (normStatus.includes("SCHEDULED")) {
    badgeClass = "scheduled";
  }

  return (
    <span className={`status-badge ${badgeClass}`}>
      <span className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
      {status}
    </span>
  );
}

export default StatusBadge;
