import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import pickle

# Load original dataset
df = pd.read_csv("historical_weather.csv")

# Rename columns to match model expectations
df = df.rename(columns={
    "Temperature (C)": "temp",
    "Humidity": "humidity",
    "Wind Speed (km/h)": "wind_speed",
    "Pressure (millibars)": "pressure",
    "Summary": "weather_desc",
    "Precip Type": "precip"
})

# Drop rows with missing values
df.dropna(subset=["temp", "humidity", "wind_speed", "pressure", "weather_desc", "precip"], inplace=True)

# Create binary target column 'rain'
df["rain"] = df["precip"].apply(lambda x: 1 if x.strip().lower() == "rain" else 0)

# Encode weather description text
le = LabelEncoder()
df["weather_desc"] = le.fit_transform(df["weather_desc"])

# Define features and target
X = df[["temp", "humidity", "wind_speed", "pressure", "weather_desc"]]
y = df["rain"]

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Save the trained model
with open("rain_predictor.pkl", "wb") as f:
    pickle.dump(model, f)

print("✅ Model trained and saved as 'rain_predictor.pkl'")
