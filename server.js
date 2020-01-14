'use strict'

const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3001;

const cors = require('cors');
app.use(cors());

// route

// app.get('/location', (request, response) => {
//  first question: how is the front end sending data?
// console.log(request.query.city);
// })

app.use(express.static('./public'));

// app.get('/', (request, response) => {
//   response.send(('Hell low whirled'))
// });

app.get('/hello', (request, response) => {
  response.send('Hello from the hello route!')
});

app.get('/allbase', (request, response) => {
  response.send('Are belong to us!')
});

app.listen(PORT, () => {
  console.log(`app is up and running on Port: ${PORT}`);
})