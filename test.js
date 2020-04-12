window.onload = function(){

const weatherStateChanges = [
    [0,     "Partly Cloudy"],
    [4,     "Misty"],
    [7,     "Mostly Cloudy"],
    [11,    "Clear"],
    [14,    "Misty"],
    [16,    "Clear"],
    [28,    "Misty"],
    [31,    "Clear"],
    [41,    "haze"],
    [45,    "Partly Cloudy"],
    [52,    "Misty"],
    [55,    "Cloudy"],
    [62,    "Foggy"],
    [66,    "Cloudy"],
    [72,    "Partly Cloudy"],
    [78,    "Foggy"],
    [82,    "Cloudy"],
    [92,    "Mostly Clear"],
    [104,   "Partly Cloudy"],
    [105,   "Drizzling"],
    [108,   "Partly Cloudy"],
    [125,   "Misty"],
    [128,   "Partly Cloudy"],
    [131,   "Raining"],
    [134,   "Drizzling"],
    [137,   "Cloudy"],
    [148,   "Misty"],
    [151,   "Mostly Cloudy"],
    [155,   "Foggy"],
    [159,   "Clear"],
    [176,   "Mostly Clear"],
    [196,   "Foggy"],
    [201,   "Partly Cloudy"],
    [220,   "Misty"],
    [222,   "Mostly Clear"],
    [244,   "Misty"],
    [246,   "Mostly Clear"],
    [247,   "Raining"],
    [250,   "Drizzling"],
    [252,   "Partly Cloudy"],
    [268,   "Misty"],
    [270,   "Partly Cloudy"],
    [272,   "Cloudy"],
    [277,   "Partly Cloudy"],
    [292,   "Misty"],
    [295,   "Partly Cloudy"],
    [300,   "Mostly Cloudy"],
    [306,   "Partly Cloudy"],
    [318,   "Mostly Cloudy"],
    [330,   "Partly Cloudy"],
    [337,   "Clear"],
    [367,   "Partly Cloudy"],
    [369,   "Raining"],
    [376,   "Drizzling"],
    [377,   "Partly Cloudy"]
];


var clockLabel = document.getElementById('clock');
var weatherLabel = document.getElementById('weather');
var futureLabel = document.getElementById('future');
var weatherPeriod = 384;
var gameHourLength = 120; 

function tick() {
    var date = new Date();
    var time = date.getTime();
    var mytime = getGtaTimeFromDate(time);
    var futureWeather = "";

    clockLabel.innerHTML = "Current time in GTA Online: " + gtaTime(time);
    weatherLabel.innerHTML = "Current weather: " + getWeatherForPeriodTime(mytime, 0).weather;

    for(var i = 1; i <= 5; i++){
        futureWeather = futureWeather + "<p>" + getWeatherForPeriodTime(mytime, i).weather + " in " + getWeatherForPeriodTime(mytime, i).etaTime + "</p>";
    }
    futureLabel.innerHTML = futureWeather;

}

function gtaTime(time) { 
    hours =  Math.floor(time / (2000 * 60)) % 24;
    minutes = Math.floor(time / 2000) % 60;
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return hours + ":" + minutes + " " + ampm;
}

function getGtaTimeFromDate(d) {
    var timestamp = Math.floor(d / 1000.0);
    var gtaHoursTotal = timestamp / gameHourLength;

    return gtaHoursTotal % weatherPeriod;

}

function getWeatherForPeriodTime(periodTime, next) {
    var wea = null;
    var eta = null;
    if (periodTime > weatherPeriod || periodTime < 0) return wea;
    for (var i = 0; i < weatherStateChanges.length; i++) {
        if (weatherStateChanges[i][0] > periodTime) {
            if(next == 0){
                wea = weatherStateChanges[i - 1][1];
            } else {
                wea = weatherStateChanges[i - 1 + next][1];
                eta = secToVerboseInterval((weatherStateChanges[i - 1 + next][0] - periodTime) * 120);
            }
            break;
        }
    }
    if (wea === null) wea = weatherStateChanges[weatherStateChanges.length - 1][1];
    return {weather: wea, etaTime: eta};
}


function secToVerboseInterval(seconds) {
    if (seconds < 60) return "Less than 1 minute";

    var sMod60  = seconds % 60;
    var hours   = Math.floor(seconds / 3600 + (sMod60 / 3600));
    var minutes = Math.floor((seconds - (hours * 3600)) / 60 + (sMod60 / 60));
    var ret =
        (hours > 0 ? (hours + (hours > 1 ? " hours " : " hour ")) : "") +
        (minutes > 0 ? (minutes + (minutes > 1 ? " minutes" : " minute")) : "");
    if (ret.endsWith(" ")) ret = ret.slice(0, -1);
    return ret;
}



tick();
var timer = setInterval(tick, 2000);
}