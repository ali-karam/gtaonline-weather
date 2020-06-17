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

var clockObj = document.getElementById('clock');
var curWeatherObj = document.getElementById('weather');
var futWeatherObj = document.getElementById('future');
var weatherPeriod = 384;
var gameHourLength = 120;
var numForecasts = 7; 
var first = true;

function tick() {
    var date = new Date();
    var currentTime = date.getTime();
    var gameTime = getGtaTime(currentTime);

    clockObj.innerHTML = "GTA Online Time: " + 
        showGtaTime(currentTime);
    updateWeather(gameTime);
}

function updateWeather(gtaTime){
    var futureWeather = "";
    var currentWeather = "";
    
    if(gtaTime % 1 >= 0.255 && gtaTime % 1 <= 0.27 || gtaTime % 1 >= 0.755 && 
        gtaTime % 1 <= 0.77 || first){
        
        currentWeather = "<div class='col-12 col-md-6 col-xl-3'><p class='" + 
        getWeatherForPeriodTime(gtaTime, 0).weatherState + "'>Current weather: " + 
            getWeatherForPeriodTime(gtaTime, 0).weatherState + "</p></div>";

        for(var i = 1; i <= numForecasts; i++){
            futureWeather = futureWeather + "<div class='col-12 col-md-6" + 
                " col-xl-3'><p class='" + 
            getWeatherForPeriodTime(gtaTime, i).weatherState + "'>" + 
            getWeatherForPeriodTime(gtaTime, i).weatherState + " in " + 
            getWeatherForPeriodTime(gtaTime, i).etaTime + "</p></div>";
        }
        currentWeather = currentWeather.replace(/(\')(\w+)(\s)/mg, "'$2-");
        futureWeather = futureWeather.replace(/(\')(\w+)(\s)/mg, "'$2-");
        curWeatherObj.innerHTML = currentWeather;
        futWeatherObj.innerHTML = currentWeather + futureWeather;
        first = false;
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

function getGtaTime(time) {
    var timestamp = Math.floor(time / 1000.0);
    var gtaHoursTotal = timestamp / gameHourLength;
    return gtaHoursTotal % weatherPeriod;

}

function getWeatherForPeriodTime(periodTime, next) {
    var weather = null;
    var eta = null;
    var currIndex, nextIndex;
    var size = weatherStateChanges.length;

    for(var i = 0; i < size; i++){
        nextIndex = (periodTime >= weatherStateChanges[size - 1][0]) ? 1 : i + 1;

        if(periodTime < weatherStateChanges[nextIndex][0]){
                currIndex = i;
                break;
        } else {
            currIndex = size - 1;
        }
    }
    if(next == 0){
        weather = weatherStateChanges[currIndex][1];
    } 
    else if(currIndex + next < size) {
        weather = weatherStateChanges[currIndex + next][1];
        eta = secToVerboseInterval((weatherStateChanges[currIndex + 
            next][0] - periodTime) * 120);
    } else {
        weather = weatherStateChanges[currIndex + next - size + 1][1];
        eta = secToVerboseInterval((weatherStateChanges[currIndex + next - 
            size + 1][0] - periodTime + weatherPeriod) * 120);        
    }
    return {weatherState: weather, etaTime: eta};
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