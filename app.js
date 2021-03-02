let now = new Date();
let date = now.getDate();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "Octomber",
  "November",
  "December",
];

let month = months[now.getMonth()];
let hour = ("0" + now.getHours()).slice(-2);
let year = now.getFullYear();
let minutes = ("0" + now.getMinutes()).slice(-2);
let currentDate = document.querySelector("p#current-date");
currentDate.innerHTML = `${day} ${date} ${month},${year} ${hour}:${minutes}`;
let baseUrl = "https://api.openweathermap.org/data/2.5/weather";
let apiKey = "c0f3afe2be69a14ab9fb1d02ca6c2d47";
let pinButton = document.querySelector("#pin-button");
let findButton = document.querySelector("#find-city");
let unitSystem = "metric";
let unit = "°C";

console.log(unit);
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
  if (clickTarget.contains("js-celsius")) {
    unitSystem = "metric";
    unit = "°C";
  } else {
    unitSystem = "imperial";
    unit = "F";
  }
}

function showWeather(response) {
  console.log(response);
  document.querySelector("p#cities").innerHTML = response.data.name;
  let temperature = Math.round(response.data.main.temp);

  let temperatures = document.querySelectorAll(".celsius");
  console.log(temperatures);

  temperatures.forEach(
    (element) => (element.innerHTML = `${temperature}${unit}`)
  );

  let description = document.querySelector("#weather-description");
  description.innerHTML = response.data.weather[0].description;
  let windCondition = document.querySelector("#wind-speed");
  windCondition.innerHTML = `${Math.round(response.data.wind.speed)}mph`;
  let humidityCondition = document.querySelector("#humidity");
  humidityCondition.innerHTML = `${response.data.main.humidity}%`;
  let precipitation = Math.round(response.data.main.pressure);
  let precipitationCondition = document.querySelector("#precipitation");
  precipitationCondition.innerHTML = `${precipitation}%`;
}

function handleClick(event) {
  event.preventDefault();
  console.log(event.currentTarget.id);
  if (event.currentTarget.id === "pin-button") {
    getWeatherFromLocation();
  } else {
    let city = document.querySelector("#search-location").value;
    let apiUrl = `${baseUrl}?q=${city}&appid=${apiKey}&units=${unitSystem}`;
    axios.get(apiUrl).then(showWeather);
  }
}
function getWeatherFromLocation() {
  navigator.geolocation.getCurrentPosition((position) => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let apiUrl = `${baseUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unitSystem}`;
    axios.get(apiUrl).then(showWeather);
  });
}
