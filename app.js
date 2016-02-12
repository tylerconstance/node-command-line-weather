// Let's do this thing.

// Set up a free account on forecast.io to get an API key to plug in here
var key = "xxxxxxxxxxxxxxxxxxxxxxxxx";

// I'll need to require the https module
var https = require("https");
// And I'll add the http request to test the status code
var http = require("http");

function printError(error){
  console.error("Whoops. " + error.message);
}

function fahrenheitToCelcius(tempF){
  var celcius = (tempF - 32)*(5/9);
  return Math.round(celcius*100)/100;
}

function getWeather(city,lat,long){
  var request = https.get("https://api.forecast.io/forecast/" + key + "/" + lat + ","+long, function(response){
    if (response.statusCode === 200){
      var body = "";
      response.on('data', function(chunk){
        body+=chunk;
      });
      response.on('end',function(){
        try{
          var weather = JSON.parse(body);
          // console.log(weather);
          console.log("Weather in "+ city + " is currently " + weather.currently.summary + " and " + weather.currently.temperature + "ºF (" + fahrenheitToCelcius(weather.currently.temperature) +"ºC)")
        } catch(error){
          // Error
          printError(error);
        }
      });
    } else {
      // bad status code
    }
  });
}

// Let's get the longitude and lattitude from a zip code
// We can do this with zippopotam.us

function getCoords(zip){
  var request = http.get("http://api.zippopotam.us/us/" + zip, function(response){
    if (response.statusCode === 200){
      var body = "";

      response.on('data', function(chunk){
        body += chunk;
      });

      response.on('end',function(){
        try{
          var location = JSON.parse(body);
          var latitude = location.places[0].latitude;
          var longitude = location.places[0].longitude;
          var city = location.places[0]["place name"];
          getWeather(city,latitude,longitude);
          // console.log(location);
          // console.log("Latitude is " + location.places[0].latitude);
          // console.log("Longitude is " + location.places[0].longitude);
        } catch(error){
          // Error ...
          printError(error);
        }
      });
    }
  }); // End request
}// End getCoords function
if (process.argv.length != 3){
  getCoords("04101");
  console.log("Getting current weather in Portland, ME.\nTo get another city's weather, run 'node app.js XXXXX' where XXXXX is your city's zip code.")
} else {
  getCoords(process.argv[2]);
}
