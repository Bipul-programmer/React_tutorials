import { useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Loading from "./components/Loading";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!city.trim()) {
      return;
    }

    setLoading(true);
    setError(null);
    setWeather(null);

    try {

      const locationResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city.trim()
        )}&count=1&language=en&format=json`
      );
      const locationData = await locationResponse.json();

      if (!locationData.results || locationData.results.length === 0) {
        setError(`City "${city}" not found. Please try another city.`);
        setLoading(false);
        return;
      }

      const location = locationData.results[0];
      const displayName = [location.name, location.admin1, location.country]
        .filter(Boolean)
        .join(", ");
      setLocationName(displayName);

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&timezone=auto`
      );

      if (!weatherResponse.ok) {
        throw new Error("Failed to fetch weather forecast data.");
      }

      const weatherData = await weatherResponse.json();
      setWeather(weatherData);
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError("An error occurred while fetching weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>🌦️ Weather App</h1>

      <SearchBar
        city={city}
        setCity={setCity}
        onSearch={handleSearch}
        disabled={loading}
      />

      {error && <div className="error-message">⚠️ {error}</div>}

      {loading && <Loading />}

      {!loading && weather && (
        <WeatherCard weatherData={weather} locationName={locationName} />
      )}
    </div>
  );
}

export default App;