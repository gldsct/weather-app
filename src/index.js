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

function getDaysFeatures (address, data) {
    const currentFeatures = function () {
        const current = data["currentConditions"];
        const time = current.datetime;
        const conditions = current.conditions;
        const temp = current.temp;
        const humidity = current.humidity;
        const windSpeed = current.windspeed;
        const icon = current.icon;
        return {
            address,
            time,
            conditions,
            temp,
            humidity,
            windSpeed,
            icon
        };
    };

    const hourlyFeatures = function () {
        const hourly = data["days"][0]["hours"];
        return hourly;
    };
    
    return { current: currentFeatures(),
        hourly: hourlyFeatures()
     };
}

async function getData (location, date, day) {
    const apiResponse = await getApiResponse(location);
    let features;
    if (arguments.length === 2) {
        switch (date) {
            case "today":
                features = await getDaysFeatures(apiResponse.resolvedAddress, apiResponse);
                break;
        }
    }
    else {
        switch (day) {
            case 1:
                features = await getHourlyFeatures(apiResponse.resolvedAddress, apiResponse["days"][1]);
                break;
            case 2:
                features = await getHourlyFeatures(apiResponse.resolvedAddress, apiResponse["days"][2]);
                break;
            case 3:
                features = await getHourlyFeatures(apiResponse.resolvedAddress, apiResponse["days"][3]);
                break;
            case 4:
                features = await getHourlyFeatures(apiResponse.resolvedAddress, apiResponse["days"][4]);
                break;
            case 5:
                features = await getHourlyFeatures(apiResponse.resolvedAddress, apiResponse["days"][5]);
                break;
            case 6:
                features = await getHourlyFeatures(apiResponse.resolvedAddress, apiResponse["days"][6]);
                break;
            case 7:
                features = await getHourlyFeatures(apiResponse.resolvedAddress, apiResponse["days"][7]);
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
    if (inputLocation.checkValidity()) {
        getData(inputLocation.value, "today").then((resolve) => {
            console.log(resolve.current, resolve.hourly);
            showWeather(resolve.current, resolve.hourly);
        });
        inputLocation.value = "";
    }
    else {
        alert("Please enter a location before submitting!");
    }
});

function showWeather (currentFeatures, hourlyFeatures) {
    mainContent.textContent = "";
    miscContent.textContent = "";

    function showMainContent () {
        (function showBackgroundImage () {
            const weatherCard = document.querySelector(".weather-card");
            if (currentFeatures.time > "12:00:00" && currentFeatures.time < "23:59:59") {
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
            locationName.textContent = currentFeatures.address;
            location.appendChild(locationName);
            mainContent.appendChild(location);

            const time = document.createElement("p");
            time.classList.add("location-time");
            time.textContent = currentFeatures.time;
            mainContent.appendChild(time);
        })();

        (function showStats () {
            (function showMainStats () {
                const mainStats = document.createElement("div");
                mainStats.classList.add("location-main-stats");
    
                const temperature = document.createElement("p");
                temperature.classList.add("location-temperature");
                temperature.textContent = `${currentFeatures.temp}°`;
                
                const icon = document.createElement("img");
                import(`./images/WeatherIcons/${currentFeatures.icon}.svg`)
                .then((module) => {
                    icon.src = module.default;
                })
                .catch(() => {
                    throw Error ("Could not load icon.");
                });
                icon.classList.add("location-status-image");
    
                mainStats.appendChild(icon);
                mainStats.appendChild(temperature);

                const mainStatsSummary = document.createElement("p");
                mainStatsSummary.textContent = currentFeatures.conditions;
                mainStatsSummary.classList.add("location-main-stats-summary");
    
                mainContent.appendChild(mainStats);
                mainContent.appendChild(mainStatsSummary);
            })();

            (function showMiscStats () {
                const miscStats = document.createElement("div");
                miscStats.classList.add("location-misc-stats");

                const humidity = document.createElement("p");
                humidity.textContent = "Humidity - " + currentFeatures.humidity + "%";

                const windspeed = document.createElement("p");
                windspeed.textContent = "Wind - " + currentFeatures.windSpeed + " km/h";

                miscStats.appendChild(humidity);
                miscStats.appendChild(windspeed);

                mainContent.appendChild(miscStats);
            })();
        })();

        mainContent.style.color = (currentFeatures.time > "12:00:00") ? "white" : "#2C2128";
    }

    function showMiscContent() {
        let startIndex = 0;
        const miscHeader = document.createElement("p");
        const miscContainer = document.createElement("div");

        let allHourlyFeatures = [];
        hourlyFeatures.forEach((hour) => {
            const icon = hour.icon;
            const temp = hour.temp;
            const time = hour.datetime.slice(0, 5);
            const formattedTime = time >= "12:00" ? time.slice(0, 2) === "12" ? `${time} PM` : `${time.slice(0, 2) - 12}:${time.slice(3, 5)} PM` : `${time} AM`; 
            allHourlyFeatures.push({ formattedTime, temp, icon });
        });
        console.log(allHourlyFeatures);

        function showMiscHeader () {
            miscHeader.classList.add("misc-weather-content-header");
            miscHeader.textContent = "Weather Today";
            miscContent.appendChild(miscHeader);
        }

        function showMiscContainer () {
            miscContainer.classList.add("misc-weather-content-container");

            startIndex = currentFeatures.time > "20:00:00" ? 20 : Number(currentFeatures.time.slice(0, 2));
            showDetails(allHourlyFeatures, startIndex);

            miscContent.appendChild(miscContainer);
        }

        function showDetails (allHourlyFeatures, start) {
            miscContainer.textContent = "";
            for (let i = start; i <= start + 3; i++) {
                const subcontainer = document.createElement("div");
    
                const icon = document.createElement("img");
                import(`./images/WeatherIcons/${allHourlyFeatures[i].icon}.svg`)
                .then((module) => {
                    icon.src = module.default;
                })
                .catch(() => {
                    throw Error ("Could not load icon.");
                });
                icon.classList.add("misc-hourly-status-icon");
                subcontainer.appendChild(icon);
    
                const time = document.createElement("p");
                time.classList.add("misc-hourly-time");
                time.textContent = allHourlyFeatures[i]["formattedTime"];
                subcontainer.appendChild(time);
    
                const temp = document.createElement("p");
                temp.classList.add("misc-hourly-temp");
                temp.textContent = allHourlyFeatures[i].temp + "°";
                subcontainer.appendChild(temp);
    
                miscContainer.appendChild(subcontainer);
            }
        }

        function showButtons () {
            const prevButton = document.createElement("button");
            const nextButton = document.createElement("button");
            prevButton.classList.add("misc-weather-prev");
            prevButton.textContent = "❮";
            nextButton.classList.add("misc-weather-next");
            nextButton.textContent = "❯";
            miscContent.appendChild(prevButton);
            miscContent.appendChild(nextButton);
    
            prevButton.addEventListener("click", () => {
                if ((startIndex - 1) < 0) {
                    startIndex = 0;
                }
                else {
                    startIndex = startIndex - 1;
                }
                showDetails(allHourlyFeatures, startIndex);
            });        
            
            nextButton.addEventListener("click", () => {
                if ((startIndex + 3) >= 23) {
                    startIndex = 20;
                }
                else {
                    startIndex = startIndex + 1;
                }
                showDetails(allHourlyFeatures, startIndex);
            });
        }

        showMiscHeader();
        showMiscContainer();
        showButtons();
    }

    showMainContent();
    showMiscContent();

}