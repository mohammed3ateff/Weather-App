document.getElementById('locationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the default way

    const location = document.getElementById('location').value;
    document.getElementById('weatherInfo').classList.add('hidden');
    document.getElementById('forecastInfo').classList.add('hidden');
    getWeatherData(location);
});

function getWeatherData(location) {
    const todayUrl = `https://api.weatherapi.com/v1/current.json?key=c005dbcb02464541b77132728240806&q=${location}`;
    const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=c005dbcb02464541b77132728240806&q=${location}&days=5`;

    fetch(todayUrl)
        .then(result => result.json())
        .then(data => {
            const currentData = currentWeatherData(data);
            displayWeatherData(currentData);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
        });

    fetch(forecastUrl)
        .then(result => result.json())
        .then(data => {
            const forecastData = ForecastWeatherData(data);
            displayForecastWeather(forecastData);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });

}

function currentWeatherData(data) {
    return {
        location: data.location.name,
        temperature: data.current.temp_c,
        condition: data.current.condition.text,
        icon: data.current.condition.icon,
        date: data.location.localtime
    };
}

function ForecastWeatherData(data) {
    return data.forecast.forecastday.map(day => ({
        date: day.date,
        temperature: day.day.avgtemp_c,
        icon: day.day.condition.icon
    }));
}

function displayWeatherData(data) {
    document.getElementById('dateTime').textContent = formatDate(new Date(data.date));
    document.getElementById('locationName').textContent = data.location;
    document.getElementById('temperature').textContent = data.temperature;
    document.getElementById('condition').textContent = data.condition;
    document.getElementById('icon').src = data.icon;

    document.getElementById('weatherInfo').classList.remove('hidden');
}

function displayForecastWeather(data) {
    const forecastDays = document.querySelectorAll('.forecast');

    forecastDays.forEach((day, index) => {
        if (data[index]) {
            const dateDay = day.querySelector('.date span');
            const temperatureDay = day.querySelector('.temperature span');
            const iconDay = day.querySelector('.icon');

            dateDay.textContent = formatDate(new Date(data[index].date));
            temperatureDay.textContent = data[index].temperature;
            iconDay.src = data[index].icon;

            day.classList.remove('hidden');
        } else {
            day.classList.add('hidden');
        }
    });

    document.getElementById('forecastInfo').classList.remove('hidden');
}



function formatDate(date) {
    const options = { month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}
