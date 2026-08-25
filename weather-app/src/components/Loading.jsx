import React from "react";

function Loading() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Fetching weather data...</p>
    </div>
  );
}

export default Loading;
