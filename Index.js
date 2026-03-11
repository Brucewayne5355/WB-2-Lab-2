const API_KEY = 'c7f81e8ddaa4a32a6017151fc1af619a'; 
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherDisplay = document.getElementById('weatherDisplay');
const historyList = document.getElementById('historyList');
const eventLog = document.getElementById('eventLog');


function logEvent(message) {
    const p = document.createElement('p');
    p.textContent = `> ${message}`;
    eventLog.appendChild(p);
}


function saveToHistory(city) {
    let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('weatherHistory', JSON.stringify(history));
    }
    renderHistory();
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    historyList.innerHTML = history.map(city => 
        `<li class="history-item" onclick="fetchWeather('${city}')">${city}</li>`
    ).join('');
}


async function fetchWeather(city) {
    logEvent("Sync Start: Function Triggered"); 
    weatherDisplay.innerHTML = "Loading...";


    setTimeout(() => logEvent("setTimeout (Macrotask) executed"), 0);
    Promise.resolve().then(() => logEvent("Promise.then (Microtask) executed"));

    try {
        logEvent("(ASYNC) Fetching data...");
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) throw new Error("City not found");

        const data = await response.json();
        logEvent("(ASYNC) Data received"); 
        
        displayWeather(data);
        saveToHistory(city);
    } catch (error) {
        logEvent(`Error: ${error.message}`);
        weatherDisplay.innerHTML = `<p style="color:red">${error.message}</p>`; 
    }
    
    logEvent("Sync End: Async operation continues in background");
}

function displayWeather(data) {
    weatherDisplay.innerHTML = `
        <h4>${data.name}, ${data.sys.country}</h4>
        <p>Temp: ${data.main.temp}°C</p>
        <p>Weather: ${data.weather[0].main}</p>
        <p>Humidity: ${data.main.humidity}%</p>
    `;
}

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
});

// Load history on page load [cite: 48]
window.onload = renderHistory;
