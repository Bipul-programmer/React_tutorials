import React from "react";

// Weather code to label & emoji mapping according to WMO Weather interpretation codes
const getWeatherDetails = (code) => {
  switch (code) {
    case 0:
      return { description: "Clear Sky", icon: "☀️" };
    case 1:
    case 2:
    case 3:
      return { description: "Mainly Clear / Partly Cloudy", icon: "⛅" };
    case 45:
    case 48:
      return { description: "Foggy", icon: "🌫️" };
    case 51:
    case 53:
    case 55:
      return { description: "Drizzle", icon: "🌧️" };
    case 61:
    case 63:
    case 65:
      return { description: "Rain", icon: "🌧️" };
    case 71:
    case 73:
    case 75:
      return { description: "Snow", icon: "❄️" };
    case 80:
    case 81:
    case 82:
      return { description: "Rain Showers", icon: "🌦️" };
    case 95:
    case 96:
    case 99:
      return { description: "Thunderstorm", icon: "🌩️" };
    default:
      return { description: "Unknown Weather", icon: "🌡️" };
  }
};

function WeatherCard({ weatherData, locationName }) {
  if (!weatherData || !weatherData.current) {
    return null;
  }

  const { current } = weatherData;
  const weatherInfo = getWeatherDetails(current.weather_code);

  return (
    <div className="weather-card">
      {locationName && <h2 className="location-title">📍 {locationName}</h2>}
      <div className="weather-main">
        <span className="weather-icon">{weatherInfo.icon}</span>
        <span className="temperature">
          {Math.round(current.temperature_2m)}°C
        </span>
      </div>
      <p className="condition">{weatherInfo.description}</p>
      
      <div className="weather-stats">
        <div className="stat-item">
          <span className="stat-label">Humidity</span>
          <span className="stat-value">{current.relative_humidity_2m}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Wind Speed</span>
          <span className="stat-value">{current.wind_speed_10m} km/h</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Feels Like</span>
          <span className="stat-value">{Math.round(current.apparent_temperature)}°C</span>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;