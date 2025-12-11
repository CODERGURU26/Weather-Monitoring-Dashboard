const { default: axios } = require("axios");
const { useRouter } = require("next/router");
const { useState, useEffect } = require("react");

const apikey = "feff206daa60b539abe8fae8f2ab7f29";

const Weather = () => {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}`;

        fetchWeatherData(url);
      });
    }
  }, []);

  const fetchWeatherData = async (url) => {
    try {
      const response = await axios.get(url);
      const data = response.data;
      console.log(data);
      weatherReport(data);
    } catch (err) {
      console.error("Error Fetching Weather Data", err);
    }
  };

  const searchByCity = async () => {
    try {
      const urlsearch = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
      const respone = await axios.get(urlsearch);
      const data = respone.data;
      console.log(data);
      weatherReport(data);
    } catch (err) {
      console.error("Error Fetching Weather Data:", err);
    }
    setCity("");
  };

  const weatherReport = async (data) => {
    const urlcast = `http://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${apikey}`;
    try {
      const respone = await axios.get(urlcast);
      const forecast = respone.data;
      console.log(forecast.city);
      hourForecast(forecast);
      dayForecast(forecast);

      console.log(data);
      document.getElementById("city").innerText =
        data.name + "," + data.sys.country;
      console.log(data.name, data.sys.country);

      console.log(Math.floor(data.main.temp - 273));
      document.getElementById("temperature").innerText =
        data.weather[0].description;
      console.log(data.weather[0].description);

      let icon1 = data.weather[0].icon;
      let iconurl = "https://openweathermap.org/img/wn/" + icon1 + ".png";
      document.getElementById("img").src = iconurl;
    } catch (err) {
      console.err("Error Fetching Weather Data:", err);
    }
  };

  const hourForecast = () => {
      document.querySelector("templist").innerHTML = "";
      for (let i = 0; i < 5; i++) {
        var date = new Date(forecast.list[i].dt * 1000);
        console.log((date.toLocaleTimeString(
            undefined , 'Asia/Kolkata'
        )).replace(':00' ,''))

        let hour = document.createElement('div')
        hour.setAttribute('class' , 'next')

        let div = document.createElement('div')
        let time = document.createElement('p')
        time.setAttribute('class' , 'time')
        time.innerHTML = (data.toLocaleTimeString(undefined , 'Asia/Kolkata')).replace(':00' , '')

        let temp = document.createElement('p')
        temp.innerText = Math.floor(
            (forecast.list[i].main.temp_max - 273)) + '°C' + '/' +
            Math.floor((forecast.list[i].main.temp_min - 273)) + '°C'

            div.appendChild(time)
            div.appendChild(temp)

            let desc = document.createElement('p')
            desc.setAttribute('class' , 'desc')
            desc.innerText = forecast.list[i].weather[0].description

            hour.appendChild(div)
            hour.appendChild(desc)

            document.querySelector('templist').appendChild(hour)
      }
    };

    const dayForecast = ()=>{
        document.querySelector('week').innerHTML = ''
        for(let i = 8; i<forecast.list.length ; i += 8){
            console.log(forecast.list[i])
            let div = document.createElement('div')
            div.setAttribute('class' , 'day')
            
            let day = document.createElement('p')
            day.setAttribute('class' , 'date')
            day.innerText = new Date(
                forecast.list[i].dt * 1000
            ).toDateString( undefined , 'Asia/Kolkata')

            div.appendChild(day)

            let temp = document.createElement('p');
            temp.innerText = Math.floor(
                (forecast.list[i].main.temp_max - 273)) + ' °C' + ' / ' +
                Math.floor((forecast.list[i].main.temp_min - 273)) + ' °C';
            div.appendChild(temp);

            let description = document.createElement('p');
            description.setAttribute('class', 'desc');
            description.innerText = forecast.list[i].weather[0].description;
            div.appendChild(description);

            document.querySelector('.week').appendChild(div);
        }
    }

    
    return (
        <div>
            <div className="header">
                <h1>WEATHER Monitoring Dashboard</h1>
                <div>
                    <input
                        type="text"
                        name=""
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
                    <h2 id="city">Delhi,IN</h2>
                    <div className="temp-box">
                        <p id="temperature">26 °C</p>
                    </div>
                    <span id="clouds">Broken Clouds</span>
                </div>

                <div className="divider"></div>

                <div className="forecast">
                    <p className="cast-header">Upcoming forecast</p>
                    <div className="forecast-list templist">
                        {/* Hourly forecast will be rendered here */}
                    </div>
                </div>
            </main>

            <div className="divider-2"></div>

            <div className="forecast-2">
                <p className="cast-header"> Next 4 days forecast</p>
                <div className="forecast-list-2 weekF">
                    {/* Daily forecast will be rendered here */}
                </div>
            </div>
        </div>
    );
};

export default Weather;



