function formatDate(timestamp) {
  let date = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${formatHours(timestamp)}`;
}

function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
}

let currentDateElement = document.querySelector("#current-date");
let baseUrl = "https://api.openweathermap.org/data/2.5/";
let apiKey = "c0f3afe2be69a14ab9fb1d02ca6c2d47";
let pinButton = document.querySelector("#pin-button");
let findButton = document.querySelector("#find-city");
let unitSystem = "metric";
let unit = "°C";
let city = "";
let latitude = "";
let longitude = "";
let loadingSpinner = document.querySelector("#loading");

pinButton.addEventListener("click", handleClick);
findButton.addEventListener("click", handleClick);

let switcher = document.querySelectorAll(".js-toggle-unit");

switcher.forEach(function (item) {
  item.addEventListener("click", toggleUnit);
});

window.addEventListener("load", (event) => {
  getWeatherFromLocation();
});

function toggleUnit(event) {
  let clickTarget = event.target.classList;
  event.target.classList.toggle("active");
  if (clickTarget.contains("js-celsius")) {
    unitSystem = "metric";
    unit = "°C";
  } else {
    unitSystem = "imperial";
    unit = "°F";
  }
  searchApi(city, latitude, longitude);
}

function showWeather(response) {
  currentDateElement.innerHTML = formatDate(response.data.dt * 1000);
  loadingSpinner.style.display = "none";
  document.querySelector("p#cities").innerHTML = response.data.name;
  let temperature = Math.round(response.data.main.temp);

  let temperatures = document.querySelectorAll(".celsius");
  document.querySelector("#weatherIcon").innerHTML = `
    <img src="http://openweathermap.org/img/wn/${response.data.weather[0].icon}.png" />`;
  response.data.weather[0].icon;
  temperatures.forEach((element) => (element.innerHTML = `${temperature}`));
  let description = document.querySelector("#weather-description");
  description.innerHTML = response.data.weather[0].description;
  let windCondition = document.querySelector("#wind-speed");
  windCondition.innerHTML = `${Math.round(response.data.wind.speed)}mph`;
  let humidityCondition = document.querySelector("#humidity");
  humidityCondition.innerHTML = `${response.data.main.humidity}%`;
  let pressure = Math.round(response.data.main.pressure);
  let pressureCondition = document.querySelector("#pressure");
  pressureCondition.innerHTML = `${pressure}%`;
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `
    <div class="col-2">
      <h5>
        ${formatHours(forecast.dt * 1000)}
      </h5>
      <img
        src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png"
      />
      <div class="weather-forecast-temperature">
        <strong>
          ${Math.round(forecast.main.temp_max)}°
        </strong>
        ${Math.round(forecast.main.temp_min)}°
      </div>
    </div>
  `;
  }
}

function handleClick(event) {
  event.preventDefault();
  if (event.currentTarget.id === "pin-button") {
    getWeatherFromLocation();
  } else {
    city = document.querySelector("#search-location").value;
    latitude = "";
    longitude = "";
    searchApi(city);
  }
}

function getWeatherFromLocation() {
  navigator.geolocation.getCurrentPosition((position) => {
    city = "";
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    searchApi(null, latitude, longitude);
  });
}

function searchApi(city, latitude, longitude) {
  let apiUrl = "";
  if (city) {
    apiUrl = `${baseUrl}weather?q=${city}&appid=${apiKey}&units=${unitSystem}`;
    apiUrlForecast = `${baseUrl}forecast?q=${city}&appid=${apiKey}&units=${unitSystem}`;
  } else {
    apiUrl = `${baseUrl}weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unitSystem}`;
    apiUrlForecast = `${baseUrl}forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unitSystem}`;
  }
  axios.get(apiUrl).then(showWeather);
  axios.get(apiUrlForecast).then(displayForecast);
}
