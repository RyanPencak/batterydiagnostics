// setup packages
const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const batteryData = require('./models/batteryDataModel');
const bodyParser = require('body-parser');

// define database url
const dburl = 'mongodb://ryanpencak:rvp224224@ds223738.mlab.com:23738/battery_data';

// connect mongoose cloud
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

app.use('/api/battery', require('./routes/batteryDataRoutes'));

app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;
