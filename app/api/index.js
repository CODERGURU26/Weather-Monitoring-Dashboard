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
}