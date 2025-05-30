from fastapi import FastAPI, Query
import requests
import pickle
import pandas as pd
from sklearn.preprocessing import LabelEncoder
import os
from fastapi.middleware.cors import CORSMiddleware
import dotenv
dotenv.load_dotenv()

API_KEY = os.getenv("API_KEY")

app = FastAPI()

# Load the trained model
with open("rain_predictor.pkl", "rb") as f:
    model = pickle.load(f)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Weather description encoder (same used in training)
weather_labels = ['clear sky', 'few clouds', 'scattered clouds', 'broken clouds', 
                  'shower rain', 'rain', 'thunderstorm', 'snow', 'mist', 'overcast clouds', 'light rain']
le = LabelEncoder()
le.fit(weather_labels)


@app.get("/")
def root():
    return {"message": "API is running"}

@app.get("/predict")
def predict_rain(city: str = Query(..., description="City name for prediction")):
    # 1. Get weather from OpenWeather
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    response = requests.get(url)
    
    if response.status_code != 200:
        return {"error": f"Failed to fetch weather for {city}"}

    data = response.json()

    try:
        temp = data["main"]["temp"]
        humidity = data["main"]["humidity"]
        wind_speed = data["wind"]["speed"]
        pressure = data["main"]["pressure"]
        weather_desc = data["weather"][0]["description"]
    except KeyError:
        return {"error": "Incomplete weather data from API"}

    # Encode weather description
    if weather_desc not in le.classes_:
        return {"error": f"Weather type '{weather_desc}' not recognized by model"}
    
    weather_desc_encoded = le.transform([weather_desc])[0]

    # Prepare input for model
    features = pd.DataFrame([{
        "temp": temp,
        "humidity": humidity,
        "wind_speed": wind_speed,
        "pressure": pressure,
        "weather_desc": weather_desc_encoded
    }])

    # Predict
    prediction = model.predict(features)[0]
    will_rain = bool(prediction)

    return {
        "city": city,
        "temperature": temp,
        "humidity": humidity,
        "weather_description": weather_desc,
        "will_rain": will_rain
    }
