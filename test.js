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
    [41,    "Hazey"],
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
var numForecasts = 5; 
var first = true;

function tick() {
    var date = new Date();
    var time = date.getTime();
    var gtaTime = getGtaTimeFromDate(time);
    var futureWeather = "";
    
    clockLabel.innerHTML = "Current time in GTA Online: " + showGtaTime(time);

    if(gtaTime % 1 >= 0 && gtaTime % 1 <= 0.01 || first == true){
        weatherLabel.innerHTML = "Current weather: " + 
            getWeatherForPeriodTime(gtaTime, 0).weather;
        for(var i = 1; i <= numForecasts; i++){
            futureWeather = futureWeather + "<p>" + 
            getWeatherForPeriodTime(gtaTime, i).weather + " in " + 
            getWeatherForPeriodTime(gtaTime, i).etaTime + "</p>";
        }
        first = false;
        futureLabel.innerHTML = futureWeather;
    }
}

function showGtaTime(time) { 
    hours =  Math.floor(time / (2000 * 60)) % 24;
    minutes = Math.floor(time / 2000) % 60;
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return hours + ":" + minutes + " " + ampm;
}

function getGtaTimeFromDate(date) {
    var timestamp = Math.floor(date / 1000.0);
    var gtaHoursTotal = timestamp / gameHourLength;
    return gtaHoursTotal % weatherPeriod;

}

function getWeatherForPeriodTime(periodTime, next) {
    var wea = null;
    var eta = null;
    var currIndex;
    var after, previous, test;
    var end = weatherStateChanges.length;

    for(var i = 0; i < end; i++){
        after = (periodTime > weatherStateChanges[end - 1][0]) ? 1 : i + 1;

        if(periodTime < weatherStateChanges[after][0]){
                currIndex = i;
                break;
        } else {
            currIndex = end - 1;
        }
    }
    
    if(next == 0){
        wea = weatherStateChanges[currIndex][1];
    } 
    else if(currIndex + next < end) {
        wea = weatherStateChanges[currIndex + next][1];
        eta = secToVerboseInterval((weatherStateChanges[currIndex + 
            next][0] - periodTime) * 120);
    } else {
        wea = weatherStateChanges[currIndex + next - end + 1][1];
        eta = secToVerboseInterval((weatherStateChanges[currIndex + next - 
            end + 1][0] - periodTime + weatherPeriod) * 120);        
    }
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
};