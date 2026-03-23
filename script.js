const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("city");
const card = document.getElementById("card");
const apiKey = "79694d82918bf2ee63f6f0e050fede45";

weatherForm.addEventListener("submit", async e => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if(city){
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        } catch (error) {
            displayError(error);
        }
    }else{
        displayError("Please enter a city");
    }
});

async function getWeatherData(city) {
    // Step 1: Get latitude & longitude
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.length) {
        throw new Error("City not found");
    }

    const lat = geoData[0].lat;
    const lon = geoData[0].lon;

    // Step 2: Use lat & lon in weather API
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("Could not fetch weather data");
    }

    return await response.json();
}

function displayWeatherInfo(data) {
    const {name:city,
          main : {temp,humidity},
          weather:[{description,id}]
    } = data;
    card.textContent = "";
    card.style.display = "flex";

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");
    cityDisplay.textContent = city;
    tempDisplay.textContent = `${temp}°C`;
    humidityDisplay.textContent = `Humidity : ${humidity}%`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);
    cityDisplay.id = "cityDisplay";
    tempDisplay.id = "tempDisplay";
    humidityDisplay.id = "humidityDisplay";
    descDisplay.id = "descDisplay";
    weatherEmoji.id= "weatherEmoji";
    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);
}

function getWeatherEmoji(weatherId){
    switch(true){
        case(weatherId>=200&&weatherId<300):return "⛈️";
        case(weatherId>=300&&weatherId<600):return "🌧️";
        case(weatherId>=600&&weatherId<700):return "☃️";
        case(weatherId>=700&&weatherId<800):return "🌥️";
        case(weatherId===800):return "☀️";
        case(weatherId>=801&&weatherId<810):return "☁️";
        default:return "🌡️";
    }
}

function displayError(message){
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.id = "displayError";

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}