import { useState } from 'react';
import './App.css';
//k

function App() {
  const [city, setCity] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fetchPrediction = async () => {
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
      setError("Network error");
      setResult(null);
    }
  };

  return (
    <div className="App">
      <h1>Rainfall Prediction</h1>
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchPrediction}>Predict</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div>
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
