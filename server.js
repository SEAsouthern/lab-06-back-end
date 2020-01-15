'use strict'

const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3001;

const cors = require('cors');
app.use(cors());

const superagent = require('superagent');
// app.use(superagent());

// route

let dataArray = [];

// GET https://us1.locationiq.com/v1/search.php?key=YOUR_PRIVATE_TOKEN&q=SEARCH_STRING&format=json

app.get('/location', (request, response) => {
//  first question: how is the front end sending data?
// console.log(request.query.city);
// now put into a variable
try {
  let reqCity = request.query.city;
  superagent.get(`https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATION_IQ_API}&q=${reqCity}&format=json`)
    .then((results) => {
      // console.log(results.body);
      const responseObj = new mapObject(reqCity, results.body);
      // response.status(200).json(responseObj);
      response.send(responseObj);
    });
  // const geoData = require('./data/geo.json');
  // send back formatted data object
  // let getLocationDataResults = geoData[0];

  // let location = new mapObject(city, getLocationDataResults);
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
  this.formatted_query = geoDataResults[0].display_name;
  this.latitude = geoDataResults[0].lat;
  this.longitude = geoDataResults[0].lon;
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