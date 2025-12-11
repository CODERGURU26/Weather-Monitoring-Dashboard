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
}