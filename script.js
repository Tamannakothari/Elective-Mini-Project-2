const tempEl = document.getElementById("temp");
const descEl = document.getElementById("desc");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const forecastEl = document.getElementById("forecast");
const loading = document.getElementById("loading");
const errorMsg = document.getElementById("error");
const toggleBtn = document.getElementById("toggleUnit");

let isCelsius = true;

// Boston coordinates
const lat = 42.36;
const lon = -71.06;

const weatherCodes = {
  0: "Clear sky ☀️",
  1: "Mainly clear 🌤️",
  2: "Partly cloudy ⛅",
  3: "Overcast ☁️",
  45: "Fog 🌫️",
  48: "Fog 🌫️",
  51: "Drizzle 🌦️",
  61: "Rain 🌧️",
  71: "Snow ❄️"
};

async function getWeather() {
  loading.classList.remove("hidden");
  errorMsg.classList.add("hidden");

  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=America/New_York`
    );

    const data = await res.json();

    displayCurrent(data.current);
    displayForecast(data.daily);

  } catch (err) {
    errorMsg.textContent = "Failed to load weather data.";
    errorMsg.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}

function displayCurrent(current) {
  let temp = current.temperature_2m;

  if (!isCelsius) {
    temp = (temp * 9/5) + 32;
  }

  tempEl.textContent = `Temperature: ${temp.toFixed(1)}°${isCelsius ? "C" : "F"}`;
  descEl.textContent = weatherCodes[current.weather_code] || "Unknown";
  humidityEl.textContent = `Humidity: ${current.relative_humidity_2m}%`;
  windEl.textContent = `Wind: ${current.wind_speed_10m} km/h`;
}

function displayForecast(daily) {
  forecastEl.innerHTML = "";

  for (let i = 1; i <= 3; i++) {
    let max = daily.temperature_2m_max[i];
    let min = daily.temperature_2m_min[i];

    if (!isCelsius) {
      max = (max * 9/5) + 32;
      min = (min * 9/5) + 32;
    }

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <p>${weatherCodes[daily.weather_code[i]] || ""}</p>
      <p>H: ${max.toFixed(1)}°</p>
      <p>L: ${min.toFixed(1)}°</p>
    `;

    forecastEl.appendChild(card);
  }
}

toggleBtn.addEventListener("click", () => {
  isCelsius = !isCelsius;
  toggleBtn.textContent = isCelsius ? "Switch to °F" : "Switch to °C";
  getWeather();
});

getWeather();