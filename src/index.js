import "./styles.css"
import { apiKey } from "./api_key";
import locationIconImage from "./images/location.png";
import morningImage from "./images/morning.jpg";
import nightImage from "./images/night.jpg";

async function getApiResponse (location) {
    try {
        const url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + location + "/next7days?unitGroup=metric&include=current%2Cdays%2Chours&key=" + apiKey + "&contentType=json";
        const response = await fetch (url);
        const weatherData = await response.json();
        return weatherData;
    }
    catch (error) {
        console.log(error.message);
    }
}

function getDaysFeatures (address, day) {
    const time = day.datetime;
    const conditions = day.conditions;
    const temp = day.temp;
    const humidity = day.humidity;
    const windSpeed = day.windspeed;
    const icon = day.icon;
    const weatherData = {
        address,
        time,
        conditions,
        temp,
        humidity,
        windSpeed,
        icon
    };
    return weatherData;
}

async function getData (location, date, day) {
    const apiResponse = await getApiResponse(location);
    let features;
    if (arguments.length === 2) {
        switch (date) {
            case "current":
                features = await getDaysFeatures(apiResponse.resolvedAddress, apiResponse["currentConditions"]);
                break;
            case "today":
                features = await getDaysFeatures(apiResponse.resolvedAddress, apiResponse["days"][0]);
                break;
        }
    }
    else {
        switch (day) {
            case 1:
                features = await getDaysFeatures(apiResponse.resolvedAddress, apiResponse["days"][1]);
                break;
            case 2:
                features = await getDaysFeatures(apiResponse.resolvedAddress, apiResponse["days"][2]);
                break;
            case 3:
                features = await getDaysFeatures(apiResponse.resolvedAddress, apiResponse["days"][3]);
                break;
            case 4:
                features = await getDaysFeatures(apiResponse.resolvedAddress, apiResponse["days"][4]);
                break;
            case 5:
                features = await getDaysFeatures(apiResponse.resolvedAddress, apiResponse["days"][5]);
                break;
            case 6:
                features = await getDaysFeatures(apiResponse.resolvedAddress, apiResponse["days"][6]);
                break;
            case 7:
                features = await getDaysFeatures(apiResponse.resolvedAddress, apiResponse["days"][7]);
                break;
            default:
                console.log("Invalid date.");
            }
    }
    return features;
}

const inputLocation = document.querySelector("#location");
const submitButton = document.querySelector(".location-input-submit");
const mainContent = document.querySelector(".main-weather-content");
const miscContent = document.querySelector(".misc-weather-content");

submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    getData(inputLocation.value, "current").then((resolve) => {
        console.log(resolve);
        showWeather(resolve);
    });
    inputLocation.value = "";
});

function showWeather (features) {
    mainContent.textContent = "";
    miscContent.textContent = "";

    function showMainContent () {
        (function showBackgroundImage () {
            const weatherCard = document.querySelector(".weather-card");
            if (features.time > "12:00:00" && features.time < "23:59:59") {
                weatherCard.style.backgroundImage = `url(${nightImage})`;
            }
            else {
                weatherCard.style.backgroundImage = `url(${morningImage})`;
            }
        })();

        (function showLocationInfo () {
            const location = document.createElement("div");
            location.classList.add("weather-location");
    
            const locationIcon = document.createElement("img");
            locationIcon.src = locationIconImage;
            locationIcon.width = 25;
            locationIcon.height = 25;
            location.appendChild(locationIcon);
    
            const locationName = document.createElement("p");
            locationName.textContent = features.address;
            location.appendChild(locationName);
            mainContent.appendChild(location);

            const time = document.createElement("p");
            time.classList.add("location-time");
            time.textContent = features.time;
            mainContent.appendChild(time);
        })();

        (function showStats () {
            (function showMainStats () {
                const mainStats = document.createElement("div");
                mainStats.classList.add("location-main-stats");
    
                const temperature = document.createElement("p");
                temperature.classList.add("location-temperature");
                temperature.textContent = `${features.temp}°`;
    
                const status = document.createElement("div");
                const statusText = document.createElement("p");
                statusText.textContent = features.conditions;
                
                const statusImage = document.createElement("img");
                import(`./images/WeatherIcons/${features.icon}.svg`)
                .then((module) => {
                    statusImage.src = module.default;
                })
                .catch(() => {
                    throw Error ("Could not load icon.");
                });
                statusImage.classList.add("location-status-image");
    
                status.appendChild(statusImage);
                status.appendChild(statusText);
    
                mainStats.appendChild(status);
                mainStats.appendChild(temperature);
    
                mainContent.appendChild(mainStats);
            })();

            (function showMiscStats () {
                const miscStats = document.createElement("div");
                miscStats.classList.add("location-misc-stats");

                const humidity = document.createElement("p");
                humidity.textContent = "Humidity - " + features.humidity + "%";

                const windspeed = document.createElement("p");
                windspeed.textContent = "Wind - " + features.windSpeed + " km/h";

                miscStats.appendChild(humidity);
                miscStats.appendChild(windspeed);

                mainContent.appendChild(miscStats);
            })();
        })();

        mainContent.style.color = (features.time > "12:00:00") ? "white" : "#2C2128";
    }

    showMainContent();
}