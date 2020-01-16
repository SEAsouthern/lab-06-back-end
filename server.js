'use strict'

const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3001;

const cors = require('cors');
app.use(cors());

const superagent = require('superagent');

const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => {throw err;});

// route

let dataArray = [];

let locations = {};

// app.get('/', (request, response) => {
//   response.status(200).send('ok');
// });{
// app.get('/add', (request, response) => })
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.use('*', notFoundHandler);
app.use(errorHandler);

function locationHandler(request, response) {
  let reqCity = request.query.city;
  const url = `https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATION_IQ_API}&q=${reqCity}&format=json&limit=1`;

  if (locations[url]) {
    response.send(locations[url]);
  }
  else {
    superagent.get(url)
      .then((results) => {
        const responseObj = new mapObject(reqCity, results.body);
        response.send(responseObj);
      })
    // send back formatted data object
      .catch((error) => {
        errorHander(('So sorry, something went wrong.', request, response));
      })
  }
}


const checkCity = (request, response, next) => {
  next();
}

function mapObject (city, geoDataResults) {
  this.search_query = city;
  this.formatted_query = geoDataResults[0].display_name;
  this.latitude = geoDataResults[0].lat;
  this.longitude = geoDataResults[0].lon;
}

let weathers = {};

function weatherHandler (request, response) {
  let {search_query, latitude, longitude} = request.query;
  const url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API}/${latitude},${longitude}`;
  if (weathers[url]) {
    response.send(weathers[url]);
  }
  else {
    superagent.get(url)
    .then((results) => {
      const weatherSummaries = results.body.daily.data.map(day => {
        return new Weather(day);
      });
      response.status(200).send(weatherSummaries);
    })
    .catch((error) => {
      errorHandler('So sorry, something went wrong.', request, response)
    })
  }
}

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