# **Rainfall Prediction Using Machine Learning and OpenWeather API**

This project predicts rainfall by leveraging a Machine Learning model combined with real-time weather data from the OpenWeather API. It features a FastAPI backend serving the prediction API and a React frontend for an interactive user experience.

Features:

Predicts rainfall based on historical and real-time weather data.

Integrates OpenWeather API to fetch up-to-date weather information.

REST API backend built with FastAPI for fast and scalable serving.

React frontend for easy interaction and visualization of results.

Modular design allows easy model updates or API extensions.


##Getting Started
*Prerequisites:*

Python 3.8+

    Node.js 16+ and npm or yarn (for frontend)

An [OpenWeather API KEY](https://openweathermap.org/api)


*Backend Setup*

Clone the repository:

    git clone https://github.com/rogerdemello/Rainfall-prediction-using-ML-and-OpenWeatherAPI.git
    cd Rainfall-prediction-using-ML-and-OpenWeatherAPI/backend

Create and activate a virtual environment:

    python -m venv venv
    source venv/bin/activate  # Windows: venv\Scripts\activate

Install Python dependencies:

    pip install -r requirements.txt

Set your OpenWeather API key as an environment variable or in a .env file:

    OPENWEATHER_API_KEY=your_api_key_here

Run the FastAPI server:

    uvicorn main:app --reload

    The backend will be available at http://localhost:8000

*Frontend Setup (React)*

If you have the React frontend code in this repo or a separate repo, follow these steps:

Navigate to the frontend directory:

    cd ../frontend

Install dependencies:

    npm install
    # or
    yarn install

Set the backend API URL in .env or as environment variable:

REACT_APP_BACKEND_URL=http://localhost:8000

Start the React development server:

    npm start
    # or
    yarn start

The frontend will run on http://localhost:3000

*Usage*

Use the React app UI to enter your location.

The app fetches current weather data from OpenWeather API.

ML model predicts the likelihood or amount of rainfall.

Results are displayed dynamically on the frontend.

*Technologies Used*

Backend: FastAPI, Python, scikit-learn (or your ML framework)

Frontend: React.js, Axios (for API calls)

API: OpenWeather API for live weather data

ML: Custom machine learning model trained on historical weather data



Contact

Roger Demello — [EMAIL](rogerdemello289@gmail.com)
[GitHub](https://github.com/rogerdemello)