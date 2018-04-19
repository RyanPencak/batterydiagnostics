/****************************************
* Ryan Pencak
* Bucknell University
* © 2018 Ryan Pencak ALL RIGHTS RESERVED
*****************************************/

const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const batteryData = require('./models/batteryDataModel');
const bodyParser = require('body-parser');
const axios = require('axios');

// Set Database URL
const dburl = 'mongodb://ryanpencak:rvp224224@batteries-shard-00-00-rcuv5.mongodb.net:27017,batteries-shard-00-01-rcuv5.mongodb.net:27017,batteries-shard-00-02-rcuv5.mongodb.net:27017/test?ssl=true&replicaSet=batteries-shard-0&authSource=admin';

// Connect to MongoDB with Mongoose
mongoose.connect(dburl, function (err, db) {
  if (err) {
    console.log('Unable to connect to mongoDB', err);
  }
  else {
    console.log('Connection established to ', dburl);
  }
});

app.disable('x-powered-by');
app.use(bodyParser.json());

// Set Routes
app.use('/api/battery', require('./routes/batteryDataRoutes'));
app.use('/api/email', require('./routes/emailRoutes'));

app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

/* Server Error Handling */
app.use((req, res, next) => {
  const err = new Error('Not Found');

  err.status = 404;
  next(err);
});

/* Server Error Handling */
app.use((err, _req, res, _next) => {
  console.log(err);
  if (err.status) {
    return res
    .status(err.status)
    .send(err.errors[0].messages[0]);
  }

  if (err.output && err.output.statusCode) {
    return res
    .status(err.output.statusCode)
    .set('Content-Type', 'text/plain')
    .send(err.message);
  }

  console.error(err.stack);
  res.sendStatus(500);
});


module.exports = app;
