import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import LineChart from "./components/LineChart";
import Select from "react-select";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState(null);
  const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
  const historicalApiKey = "YOUR_HISTORICAL_WEATHER_API_KEY";
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState("");

  const fetchWeatherData = async () => {
    setWeatherData(null);
    setHourlyData(null);
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit?.value}`
      );

      setError(null);

      fetchhourlyWeatherData();

      setWeatherData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  const fetchhourlyWeatherData = async () => {
    try {
      // Replace the URL with the actual historical weather API endpoint
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&cnt=10&units=${unit?.value}`
      );
      setHourlyData(response.data);
    } catch (error) {
      console.error("Error fetching historical weather data:", error);
    }
  };

  const options = [
    { value: "imperial", label: "Fahrenheit" },
    { value: "metric", label: "Celcius" },
  ];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: "1px solid #ccc",
      borderRadius: "4px",
      height: "30px",
      boxShadow: state.isFocused ? "0 0 0 1px #2684FF" : null,
      "&:hover": {
        borderColor: "#2684FF",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#2684FF" : "white",
      color: state.isSelected ? "white" : "#333",
    }),
  };

  const getIconUrl = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}.png`;
  };

  return (
    <div className="container">
      <h1>Weather App</h1>
      <div className="search_container">
        <div className="search_input">
          <input
            type="text"
            placeholder="Enter city name"
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <Select
          options={options}
          value={unit}
          onChange={setUnit}
          styles={customStyles}
          placeholder="Select Unit"
        />

        <button onClick={fetchWeatherData}>Search</button>
      </div>
      <h2 className="city_name">{weatherData && weatherData.name}</h2>

      {loading ? (
        <p>Fetching...</p>
      ) : error && !loading ? (
        <p className="error">No city found</p>
      ) : (
        <div className="weather_container">
          <div className="weather_icon">
            {weatherData && (
              <img
                src={getIconUrl(weatherData.weather[0].icon)}
                alt={weatherData.weather[0].description}
              />
            )}
          </div>
          <div className="weather_info">
            <div className="temperature">
              {weatherData && (
                <h2>{weatherData.main.temp.toFixed(0)}°C&deg;</h2>
              )}
            </div>
            <div className="weather_description">
              {weatherData && <p>{weatherData.weather[0].description}</p>}
            </div>
            <div className="feels_like">
              {weatherData && (
                <p>Feels like: {weatherData.main.feels_like.toFixed(0)}°C</p>
              )}
            </div>
            <div className="humidity">
              {weatherData && <p>Humidity: {weatherData.main.humidity}%</p>}
            </div>
            <div className="wind_speed">
              {weatherData && <p>Wind Speed: {weatherData.wind.speed} m/s</p>}
            </div>
          </div>
        </div>
      )}

      {hourlyData && (
        <div className="chart_container">
          <h2>Hourly Forecast</h2>
          <LineChart hourlyData={hourlyData} />
        </div>
      )}
    </div>
  );
}

export default App;
