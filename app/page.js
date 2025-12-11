"use client";
import axios from "axios";
import { useState, useEffect } from "react";

const apikey = "feff206daa60b539abe8fae8f2ab7f29";

const Weather = () => {
  const [city, setCity] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}`;
        fetchWeatherData(url);
      });
    }
  }, []);

  const fetchWeatherData = async (url) => {
    try {
      const response = await axios.get(url);
      const data = response.data;
      weatherReport(data);
    } catch (err) {
      console.error("Error Fetching Weather Data", err);
    }
  };

  const searchByCity = async () => {
    if (!city) return;

    try {
      const urlsearch = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
      const respone = await axios.get(urlsearch);
      const data = respone.data;
      weatherReport(data);
    } catch (err) {
      console.error("Error Fetching Weather Data:", err);
    }

    setCity("");
  };

  const weatherReport = async (data) => {
    const urlcast = `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${apikey}`;

    try {
      const respone = await axios.get(urlcast);
      const forecast = respone.data;

      hourForecast(forecast);
      dayForecast(forecast);

      document.getElementById("city").innerText =
        data.name + ", " + data.sys.country;

      document.getElementById("temperature").innerText =
        Math.floor(data.main.temp - 273) + " °C";

      let icon = data.weather[0].icon;
      let iconurl = "https://openweathermap.org/img/wn/" + icon + ".png";
      document.getElementById("img").src = iconurl;
    } catch (err) {
      console.error("Error Fetching Forecast:", err);
    }
  };

  // ------------------- HOURLY FORECAST -------------------
  const hourForecast = (forecast) => {
    const container = document.querySelector(".templist");
    container.innerHTML = "";

    for (let i = 0; i < 5; i++) {
      const list = forecast.list[i];

      let date = new Date(list.dt * 1000);

      let hour = document.createElement("div");
      hour.classList.add("next");

      let div = document.createElement("div");

      let time = document.createElement("p");
      time.classList.add("time");
      time.innerHTML = date
        .toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })
        .replace(":00", "");

      let temp = document.createElement("p");
      temp.innerText =
        Math.floor(list.main.temp_max - 273) +
        "°C / " +
        Math.floor(list.main.temp_min - 273) +
        "°C";

      div.appendChild(time);
      div.appendChild(temp);

      let desc = document.createElement("p");
      desc.classList.add("desc");
      desc.innerText = list.weather[0].description;

      hour.appendChild(div);
      hour.appendChild(desc);

      container.appendChild(hour);
    }
  };

  // ------------------- DAILY FORECAST -------------------
  const dayForecast = (forecast) => {
    const container = document.querySelector(".weekF");
    container.innerHTML = "";

    for (let i = 8; i < forecast.list.length; i += 8) {
      const list = forecast.list[i];

      let div = document.createElement("div");
      div.classList.add("day");

      let date = document.createElement("p");
      date.classList.add("date");
      date.innerText = new Date(list.dt * 1000).toDateString();

      let temp = document.createElement("p");
      temp.innerText =
        Math.floor(list.main.temp_max - 273) +
        "°C / " +
        Math.floor(list.main.temp_min - 273) +
        "°C";

      let desc = document.createElement("p");
      desc.classList.add("desc");
      desc.innerText = list.weather[0].description;

      div.appendChild(date);
      div.appendChild(temp);
      div.appendChild(desc);

      container.appendChild(div);
    }
  };

  return (
    <div>
      <div className="header">
        <h1>WEATHER Monitoring Dashboard</h1>
        <div>
          <input
            type="text"
            id="input"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button id="search" onClick={searchByCity}>
            Search
          </button>
        </div>
      </div>

      <main>
        <div className="weather">
          <h2 id="city">Delhi, IN</h2>

          <div className="temp-box">
            <p id="temperature">26 °C</p>
          </div>

          <img id="img" alt="Weather icon" />
        </div>

        <div className="divider"></div>

        <div className="forecast">
          <p className="cast-header">Upcoming forecast</p>
          <div className="forecast-list templist"></div>
        </div>
      </main>

      <div className="divider-2"></div>

      <div className="forecast-2">
        <p className="cast-header">Next 4 days forecast</p>
        <div className="forecast-list-2 weekF"></div>
      </div>
    </div>
  );
};

export default Weather;
