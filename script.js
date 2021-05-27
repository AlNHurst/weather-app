var apiKey = "c31195c36002e92b2e74fb77d06215eb"

var searchFormEl = document.getElementById("search-form");
var cityInputEl = document.getElementById("city");
var weatherContainerEl = document.getElementById("current-weather-container");
var citySearchInputEl = document.getElementById("city-input");
var forecastTitle = document.getElementById("forecast");
var forecastContainerEl = document.getElementById("fiveday-container");
var savedSearchButtonEl = document.getElementById("saved-search-buttons");
var cities = [];

var formSumbitHandler = function (event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    if (!city) {
        alert("Please enter a city in the search box!");
    } else {
        getCityWeather(city);
        get5Day(city);
        cities.unshift({ city });
        cityInputEl.value = "";
    }
    saveSearch();
    pastSearch(city);
}

var saveSearch = function () {
    localStorage.setItem("cities", JSON.stringify(cities));
};

var getCityWeather = function (city) {
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

var displayWeather = function (weather, searchCity) {
    weatherContainerEl.textContent = "";
    citySearchInputEl.textContent = searchCity;

    var currentDate = document.createElement("span")
    currentDate.textContent = " (" + moment(weather.dt.value).format("MMM D, YYYY") + ")";
    citySearchInputEl.appendChild(currentDate);

    var temperatureEl = document.createElement("li");
    temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
    temperatureEl.setAttribute("style", "font-size: 20px");
    weatherContainerEl.appendChild(temperatureEl);

    var humidityEl = document.createElement("li");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    humidityEl.setAttribute("style", "font-size: 20px");
    weatherContainerEl.appendChild(humidityEl);

    var windSpeedEl = document.createElement("li");
    windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    windSpeedEl.setAttribute("style", "font-size: 20px");
    weatherContainerEl.appendChild(windSpeedEl);

    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
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
    weatherContainerEl.appendChild(uvIndexEl);
}

var get5Day = function (city) {
    var apiKey = "844421298d794574c100e3409cee0499"
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                display5Day(data);
            });
        });
};

var display5Day = function (weather) {
    forecastContainerEl.textContent = ""
    forecastTitle.textContent = "5-Day Forecast:";

    var forecast = weather.list;
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

        var forecastTempEl = document.createElement("span");
        forecastTempEl.textContent = "Temp: " + dailyForecast.main.temp + " °F";
        forecastEl.appendChild(forecastTempEl);

        var forecastHumEl = document.createElement("span");
        forecastHumEl.textContent ="Humidity: " + dailyForecast.main.humidity + " %";
        forecastEl.appendChild(forecastHumEl);

        var forecastWindEl = document.createElement("span");
        forecastWindEl.textContent ="Wind Speed: " + dailyForecast.main.humidity + " %";
        forecastEl.appendChild(forecastWindEl);

        forecastContainerEl.appendChild(forecastEl);
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
        getCityWeather(city);
        get5Day(city);
    }
}

searchFormEl.addEventListener("submit", formSumbitHandler);
savedSearchButtonEl.addEventListener("click", pastSearchHandler);