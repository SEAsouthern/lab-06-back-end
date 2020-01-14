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
let city = request.query.city;
const geoData = require('./data/geo.json');
// send back formatted data object
let getDataResults = geoData[0];

let location = new mapObject(city, getDataResults);

response.status(200).send(location);

});

function mapObject (city, geoDataResults) {
  this.search_query = city;
  this.formatted_query = geoDataResults.display_name;
  this.latitude = geoDataResults.lat;
  this.longitude = geoDataResults.lon;
}

// Below is what front end is expecting.
// {
//   "search_query": "seattle",
//   "formatted_query": "Seattle, WA, USA",
//   "latitude": "47.606210",
//   "longitude": "-122.332071"
// }

// app.use(express.static('./public'));

// app.get('/', (request, response) => {
//   response.send(('Hell low whirled'))
// });

// app.get('/hello', (request, response) => {
//   response.send('Hello from the hello route!')
// });

// app.get('/allbase', (request, response) => {
//   response.send('Are belong to us!')
// });

app.get('*',(request, response) => {response.status(404).send('this route does not exist')});

app.listen(PORT, () => {
  console.log(`app is up and running on Port: ${PORT}`);
})