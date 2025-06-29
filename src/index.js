import "./styles.css"
import { apiKey } from "./api_key";

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
    const tempFeelsLike = day.feelslike;
    const humidity = day.humidity;
    const windSpeed = day.windspeed;
    const icon = day.icon;
    console.log(`In ${address}, on ${time}: Temperature = ${temp}°C (feels like ${tempFeelsLike}°C), Humidity = ${humidity}%, Wind = ${windSpeed} kmph.`);
    console.log(`Condition: ${conditions}. Icon: ${icon}`);
}

async function getData (location, date, day) {
    const apiResponse = await getApiResponse(location);
    console.log(apiResponse);
    if (arguments.length === 2) {
        switch (date) {
            case "current":
                getDaysFeatures(apiResponse.resolvedAddress, apiResponse["currentConditions"]);
                break;
            case "today":
                getDaysFeatures(apiResponse.resolvedAddress, apiResponse["days"][0]);
                break;
        }
    }
    else {
        switch (day) {
            case 1:
                getDaysFeatures(apiResponse.resolvedAddress, apiResponse["days"][1]);
                break;
            case 2:
                getDaysFeatures(apiResponse.resolvedAddress, apiResponse["days"][2]);
                break;
            case 3:
                getDaysFeatures(apiResponse.resolvedAddress, apiResponse["days"][3]);
                break;
            case 4:
                getDaysFeatures(apiResponse.resolvedAddress, apiResponse["days"][4]);
                break;
            case 5:
                getDaysFeatures(apiResponse.resolvedAddress, apiResponse["days"][5]);
                break;
            case 6:
                getDaysFeatures(apiResponse.resolvedAddress, apiResponse["days"][6]);
                break;
            case 7:
                getDaysFeatures(apiResponse.resolvedAddress, apiResponse["days"][7]);
                break;
            default:
                console.log("Invalid date.");
            }
    }
}

const inputLocation = document.querySelector("#location");
const submitButton = document.querySelector(".location-input-submit");

submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    getData(inputLocation.value, "current");
    inputLocation.value = "";
});