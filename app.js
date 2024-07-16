document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "Yc6ZJN6H3OjGnxDIE3UrCqF82uILGAi0";
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");
    const oneHourForecast = document.getElementById("one-hour-forecast");
    const fiveDaysForecast = document.getElementById("five-days-forecast");
    const twelveHourForecast = document.getElementById("twelve-hour-forecast");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                    fetchHourlyForecast(locationKey);
                    fetchFiveDaysForecast(locationKey);
                    fetch12HourForecast(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
            });
    }

    function fetchHourlyForecast(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                if (data && data.length > 0) {
                    displayHourlyForecast(data);
                } else {
                    oneHourForecast.innerHTML = `<p>No hourly forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching hourly forecast data:", error);
                oneHourForecast.innerHTML = `<p>Error fetching hourly forecast data.</p>`;
            });
    }

    function fetchFiveDaysForecast(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&metric=true`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
                    displayFiveDaysForecast(data.DailyForecasts);
                } else {
                    fiveDaysForecast.innerHTML = `<p>No Five Days Forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching Five Days Forecast data:", error);
                fiveDaysForecast.innerHTML = `<p>Error fetching Five Days Forecast data.</p>`;
            });
    }

    function fetch12HourForecast(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                if (data && data.length > 0) {
                    display12HourForecast(data);
                } else {
                    twelveHourForecast.innerHTML = `<p>No 12 hour Forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching 12 hour Forecast data:", error);
                twelveHourForecast.innerHTML = `<p>Error fetching 12 hour Forecast data.</p>`;
            });
    }

    function displayWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const weatherIcon = data.WeatherIcon;

        const weatherContent = `
        <img src="https://developer.accuweather.com/sites/default/files/${weatherIcon < 10 ? '0' + weatherIcon : weatherIcon}-s.png" alt="${weather}" />
            <h2>Current Weather</h2>
             
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
           
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function displayHourlyForecast(data) {
        let forecastContent = '';
        data.forEach(hour => {
            const weatherIcon = hour.WeatherIcon;
            const iconPhrase = hour.IconPhrase;

            forecastContent += `
                <div class="weather-box">
                    <img src="https://developer.accuweather.com/sites/default/files/${weatherIcon < 10 ? '0' + weatherIcon : weatherIcon}-s.png" alt="${iconPhrase}" class="HourlyForecastIcon"/>
                    <h2>Hourly Forecast</h2>
                    <p>Time: ${new Date(hour.DateTime).toLocaleTimeString()}</p>
                    <p>Temperature: ${hour.Temperature.Value}°${hour.Temperature.Unit}</p>
                    <p>Weather: ${iconPhrase}</p>
                   
                </div>
            `;
        });
        oneHourForecast.innerHTML = forecastContent;
    }

    function displayFiveDaysForecast(forecasts) {
        let forecastContent = '<h2>Daily Forecast</h2>';
        forecasts.forEach(day => {
            const date = new Date(day.Date);
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
            const temperatureMin = day.Temperature.Minimum.Value;
            const temperatureMax = day.Temperature.Maximum.Value;
            const weatherIcon = day.Day.Icon;
            const iconPhrase = day.Day.IconPhrase;

            forecastContent += `
                <div class="weather-box">
                <img src="https://developer.accuweather.com/sites/default/files/${weatherIcon}-s.png" alt="${iconPhrase}" class="DailyForecastIcon"/>
                    <p>Day: ${dayOfWeek}</p>
                    <p>Min Temperature: ${temperatureMin}°C</p>
                    <p>Max Temperature: ${temperatureMax}°C</p>
                    <p>Weather: ${iconPhrase}</p>
                    
                </div>
            `;
        });
        fiveDaysForecast.innerHTML = forecastContent;
    }

    function display12HourForecast(data) {
        let forecastContent = '<h2> 12 Hourly Forecast</h2>';
        data.forEach(hour => {
            const weatherIcon = hour.WeatherIcon; // Ensure the correct property name
            const iconPhrase = hour.IconPhrase;

            forecastContent += `
                <div class="weather-box">
                 <img src="https://developer.accuweather.com/sites/default/files/${weatherIcon < 10 ? '0' + weatherIcon : weatherIcon}-s.png" alt="${weather}" />
                    <p>Time: ${new Date(hour.DateTime).toLocaleTimeString()}</p>
                    <p>Temperature: ${hour.Temperature.Value}°${hour.Temperature.Unit}</p>
                    <p>Weather: ${iconPhrase}</p>
                    
                </div>
            `;
        });
        twelveHourForecast.innerHTML = forecastContent;
    }
});

