const { default: axios } = require("axios");
const { useRouter } = require("next/router");
const { useState, useEffect } = require("react");

const apikey = "feff206daa60b539abe8fae8f2ab7f29";

const weather = ()=>{
    const router = useRouter()
    const [city , setCity] = useState('')
    const [weatherData , setWeatherData] = useState(null)

    useEffect(()=>{
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition((position)=>{
                const {latitude , longitude} = position.coords
                const url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}`;

                fetchWeatherData(url)
            })
        }
    } , [])

    const fetchWeatherData = async(url)=>{
        try{
            const response = await axios.get(url)
            const data = response.data
            console.log(data)
            weatherReport(data)
        }
        catch(err){
            console.error("Error Fetching Weather Data" , err)
        }
    }

    const searchByCity = async()=>{
        try{
            const urlsearch = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
            const respone = await axios.get(urlsearch)
            const data = respone.data
            console.log(data)
            weatherReport(data)
        }
        catch(err){
            console.error("Error Fetching Weather Data:",err)
        }
        setCity('')
    }

    const weatherReport = async(data)=>{
        const urlcast = `http://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${apikey}`;
        try{
            const respone = await axios.get(urlcast)
            const forecast = respone.data
            console.log(forecast.city)
            hourForecast(forecast)
            dayForecast(forecast)

            console.log(data)
            document.getElementById('city').innerText = data.name + ',' + data.sys.country
            console.log(data.name , data.sys.country)

            console.log(Math.floor(data.main.temp - 273))
            document.getElementById('temperature').innerText = data.weather[0].description
            console.log(data.weather[0].description)

            let icon1 = data.weather[0].icon
            let iconurl = "https://openweathermap.org/img/wn/" + icon1 + ".png";
            document.getElementById('img').src = iconurl
        }
        catch(err){
            console.err("Error Fetching Weather Data:" , err)
        }
    }
}