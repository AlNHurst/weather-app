var apiKey = "c31195c36002e92b2e74fb77d06215eb"

var searchFormEl = document.getElementById("search-form");
var cityEl = document.getElementById("city");
var savedSearchButtonEl = document.getElementById("saved-search-buttons");
var citySearchEl = document.getElementById("city-search");
var currentWeatherEl = document.getElementById("current-weather");
var forecastTitleEl = document.getElementById("forecast");
var fiveDayWeatherEl = document.getElementById("fiveday-weather");
var cities = [];

// alert user to enter city in the search box
// populates page with current weather and 5-day forecast if user enters a city name.
var formSumbitHandler = function (event) {
    event.preventDefault();
    var city = cityEl.value.trim();
    if (!city) {
        alert("Please enter a city in the search box!");
    } else {
        renderCurrentWeather(city);
        renderFiveDay(city);
        
        // Insert most recent search to the beginning
        cities.unshift({ city });
        cityEl.value = "";
    }
    savedSearch();
    pastSearch(city);
}

var savedSearch = function () {
    localStorage.setItem("cities", JSON.stringify(cities));
};

var renderCurrentWeather = function (city) {
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    
    fetch(apiURL)
    .then(function (response) {
        return response.json()
        .then(function (data) {
            displayWeather(data, city);
                    console.log(data);
                });
            });
};

var displayWeather = function (data, searchCity) {
    currentWeatherEl.textContent = "";
    citySearchEl.textContent = searchCity;
    citySearchEl.setAttribute("style", "font-size: 24px");
    
    var currentDate = document.createElement("span")
    currentDate.textContent = " (" + moment(data.dt.value).format("MMM D, YYYY") + ")";
    citySearchEl.appendChild(currentDate);
    
    var temperatureEl = document.createElement("li");
    temperatureEl.textContent = "Temperature: " + data.main.temp + " °F";
    temperatureEl.setAttribute("style", "font-size: 20px");
    currentWeatherEl.appendChild(temperatureEl);
    
    var humidityEl = document.createElement("li");
    humidityEl.textContent = "Humidity: " + data.main.humidity + " %";
    humidityEl.setAttribute("style", "font-size: 20px");
    currentWeatherEl.appendChild(humidityEl);
    
    var windSpeedEl = document.createElement("li");
    windSpeedEl.textContent = "Wind Speed: " + data.wind.speed + " MPH";
    windSpeedEl.setAttribute("style", "font-size: 20px");
    currentWeatherEl.appendChild(windSpeedEl);
    
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    getUvIndex(lat, lon)
}

var getUvIndex = function (lat, lon) {
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
    .then(function (response) {
        return response.json()
        .then(function (data) {
            displayUvIndex(data)
        });
    });
    
}

var displayUvIndex = function (index) {
    var uvIndexEl = document.createElement("li");
    uvIndexEl.setAttribute("style", "font-size: 20px");
    uvIndexEl.textContent = "UV Index: "
    
    uvIndexValue = document.createElement("span")
    uvIndexEl.setAttribute("style", "font-size: 20px");
    uvIndexValue.textContent = index.value
    
    if (index.value <= 2) {
        uvIndexValue.classList = "low"
    }else if (index.value >= 3 && index.value <= 5) {
        uvIndexValue.classList = "moderate "
    }else if (index.value >= 6 && index.value <= 7) {
        uvIndexValue.classList = "high "
    }else if (index.value > 8) {
        uvIndexValue.classList = "very-high"
    };
    
    uvIndexEl.appendChild(uvIndexValue);
    currentWeatherEl.appendChild(uvIndexEl);
}

var renderFiveDay = function (city) {
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`
    
    fetch(apiURL)
    .then(function (response) {
        response.json().then(function (data) {
            display5Day(data);
        });
    });
};

var display5Day = function (data) {
    fiveDayWeatherEl.textContent = ""
    forecastTitleEl.textContent = "5-Day Forecast:";
    
    var forecast = data.list;
    for (var i = 5; i < forecast.length; i = i+8) {
        var dailyForecast = forecast[i];
        
        var forecastEl = document.createElement("div");
        forecastEl.classList = "card bg-secondary text-light m-2";
        
        var forecastDate = document.createElement("h5")
        forecastDate.textContent = moment.unix(dailyForecast.dt).format("MMM D, YYYY");
        forecastDate.classList = "card-header text-center"
        forecastEl.appendChild(forecastDate);
        
        
        var weatherIcon = document.createElement("img")
        weatherIcon.classList = "card-body text-center";
        weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);
        
        forecastEl.appendChild(weatherIcon);
        
        var forecastTempEl = document.createElement("li");
        forecastTempEl.textContent = "Temp: " + dailyForecast.main.temp + " °F";
        forecastTempEl.setAttribute("style", "list-style-type:none");
        forecastEl.appendChild(forecastTempEl);
        
        var forecastHumEl = document.createElement("li");
        forecastHumEl.textContent ="Humidity: " + dailyForecast.main.humidity + " %";
        forecastHumEl.setAttribute("style", "list-style-type:none");
        forecastEl.appendChild(forecastHumEl);
        
        var forecastWindEl = document.createElement("li");
        forecastWindEl.textContent ="Wind Speed: " + dailyForecast.main.humidity + " MPH";
        forecastWindEl.setAttribute("style", "list-style-type:none");
        forecastEl.appendChild(forecastWindEl);
        
        fiveDayWeatherEl.appendChild(forecastEl);
    }
}

var pastSearch = function (pastSearch) {
    
    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
    pastSearchEl.setAttribute("data-city", pastSearch)
    pastSearchEl.setAttribute("type", "submit");
    
    savedSearchButtonEl.prepend(pastSearchEl);
}

var pastSearchHandler = function (event) {
    var city = event.target.getAttribute("data-city")
    if (city) {
        renderCurrentWeather(city);
        renderFiveDay(city);
    }
}

searchFormEl.addEventListener("submit", formSumbitHandler);
savedSearchButtonEl.addEventListener("click", pastSearchHandler);


