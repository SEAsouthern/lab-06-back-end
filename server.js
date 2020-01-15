'use strict'

const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3001;

const cors = require('cors');
app.use(cors());

// route

let dataArray = [];

app.get('/location', (request, response) => {
//  first question: how is the front end sending data?
// console.log(request.query.city);
// now put into a variable
try {
  let city = request.query.city;
  const geoData = require('./data/geo.json');
  // send back formatted data object
  let getLocationDataResults = geoData[0];

  let location = new mapObject(city, getLocationDataResults);

  response.status(200).send(location);
}
catch (error) {
  errorHander(('So sorry, something went wrong.', request, response));
}
});

const checkCity = (request, response, next) => {
  next();
}

function mapObject (city, geoDataResults) {
  this.search_query = city;
  this.formatted_query = geoDataResults.display_name;
  this.latitude = geoDataResults.lat;
  this.longitude = geoDataResults.lon;
}

app.get('/weather', (request, response) => {
  try {
    const weatherData = require('./data/darksky.json');
    const weatherSummaries = weatherData.daily.data.map(day => (new Weather(day)));
    // console.log(weatherData.daily.data[1].summary);
    // console.log(weatherData.daily.data[1].time);
    response.status(200).json(weatherSummaries);
  }
  catch (error) {
    errorHandler('So sorry, something went wrong.', request, response)
  }
})

function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}

function notFoundHandler(request, response) {
  response.status(404).send('huh?');
}

function errorHandler(error, request, response) {
  response.status(500).send(error)
}

app.get('*',(request, response) => {response.status(404).send('this route does not exist')});

app.listen(PORT, () => {
  console.log(`app is up and running on Port: ${PORT}`);
})