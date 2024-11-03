let isCelsius = true;

async function fetchWeather() {
    const location = document.getElementById("location-input").value;
    if (!location) return;
    
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=4f7c4b22f31859f23dd4115aa9cd0ce4&units=${isCelsius ? "metric" : "imperial"}`);
    
        const data = await response.json();
        
        if (data.cod === 200) {
            displayCurrentWeather(data);
            fetchForecast(data.coord.lat, data.coord.lon);
        } else {
            alert("Location not found!");
        }
    } catch (error) {
        console.error("Error fetching weather:", error);
    }
}

function displayCurrentWeather(data) {
    document.getElementById("city-name").textContent = data.name;
    document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°${isCelsius ? "C" : "F"}`;
    document.getElementById("weather-description").textContent = data.weather[0].description;
    document.getElementById("weather-icon").className = `icon ${data.weather[0].main.toLowerCase()}`;
    /*weatherIcon.className = "icon";

    if (weatherCondition === "clear") {
        weatherIcon.classList.add("sunny");
    } else if (weatherCondition === "rain") {
        weatherIcon.classList.add("rainy");
    } else if (weatherCondition === "clouds") {
        weatherIcon.classList.add("cloudy");
    } else if (weatherCondition === "snow") {
        weatherIcon.classList.add("snowy");
    } else {
        weatherIcon.classList.add("default");
    }
    */
}

async function fetchForecast(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=4f7c4b22f31859f23dd4115aa9cd0ce4&units=${isCelsius ? "metric" : "imperial"}`);
        const data = await response.json();
        console.log(data);
        
        displayForecast(data.daily);
    } catch (error) {
        console.error("Error fetching forecast:", error);
    }
}

function displayForecast(dailyData) {
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = ""; // Clear previous forecast

    dailyData.slice(1, 8).forEach(day => {
        const forecastItem = document.createElement("div");
        forecastItem.className = "forecast-item";
        
        const date = new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" });
        const temp = `${Math.round(day.temp.day)}°${isCelsius ? "C" : "F"}`;
        const description = day.weather[0].main;

        forecastItem.innerHTML = `
            <p>${date}</p>
            <p>${temp}</p>
            <p>${description}</p>
        `;

        forecastContainer.appendChild(forecastItem);
    });
}

function toggleUnits() {
    isCelsius = !isCelsius;
    fetchWeather();
}
