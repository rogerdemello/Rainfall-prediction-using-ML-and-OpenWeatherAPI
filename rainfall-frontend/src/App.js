import { useState } from 'react';
import './App.css';

const CITY_LIST = [
  "Delhi", "Mumbai", "Chennai", "Kolkata", "Bengaluru", "Hyderabad", "Ahmedabad", "Pune", "Jaipur", "Lucknow",
  "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Ghaziabad", "Ludhiana",
  "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivli", "Vasai-Virar", "Varanasi", "Srinagar", "Aurangabad",
  "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad (Prayagraj)", "Ranchi", "Howrah", "Coimbatore", "Jabalpur", "Gwalior", "Vijayawada",
  "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh", "Solapur", "Hubballi-Dharwad", "Mysuru", "Tiruchirappalli"
];

function App() {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCityChange = (e) => {
    const value = e.target.value;
    setCity(value);
    setResult(null);
    setError(null);
    setHighlightIndex(-1);

    if (value.length > 0) {
      const filtered = CITY_LIST.filter(c =>
        c.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion);
    setSuggestions([]);
    setHighlightIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex(prev =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex(prev =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[highlightIndex]);
    }
  };

  const fetchPrediction = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      setResult(null);
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/predict?city=${city}`);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setResult(null);
      } else {
        setResult(data);
        setError(null);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Network error. Please try again later.");
      setResult(null);
    }
  };

const getBackgroundClass = (weather) => {
  if (!weather) return '';
  const w = weather.toLowerCase();
  if (w.includes('clear')) return 'clear-bg';
  if (w.includes('fog')) return 'foggy-bg';
  if (w.includes('rain') || w.includes('shower')) return 'rainy-bg';
  if (w.includes('snow')) return 'snowy-bg';
  if (w.includes('cloud')) return 'cloudy-bg';
  return 'cloudy-bg'; // fallback
};

  return (
    <div className={`App ${getBackgroundClass(result?.weather_description)}`}>
      <h1>Rainfall Prediction</h1>

      <div className="autocomplete-wrapper" style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={handleCityChange}
          onKeyDown={handleKeyDown}
          style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
        />
        {suggestions.length > 0 && (
          <ul
            className="suggestions-list"
            style={{
              listStyleType: 'none',
              padding: 0,
              margin: 0,
              position: 'absolute',
              width: '100%',
              backgroundColor: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              zIndex: 10,
              maxHeight: '200px',
              overflowY: 'auto',
            }}
          >
            {suggestions.map((s, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(s)}
                style={{
                  padding: '0.5rem',
                  backgroundColor: index === highlightIndex ? '#eee' : '#fff',
                  cursor: 'pointer'
                }}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={fetchPrediction} style={{ marginTop: '1rem' }}>
        Predict
      </button>

      {error && <p className="error-message">{error}</p>}

      {result && (
        <div className="result-card" style={{ marginTop: '1rem', padding: '1rem', background: '#fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
          <h2>Result</h2>
          <p><strong>City:</strong> {result.city}</p>
          <p><strong>Temperature:</strong> {result.temperature}°C</p>
          <p><strong>Humidity:</strong> {result.humidity}%</p>
          <p><strong>Weather:</strong> {result.weather_description}</p>
          <p><strong>Will Rain:</strong> {result.will_rain ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
}

export default App;
