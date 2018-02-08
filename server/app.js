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

// app.use((req, res, next) => {
//   const err = new Error('Not Found');
//
//   err.status = 404;
//   next(err);
// });
//
// app.use((err, _req, res, _next) => {
//   console.log(err);
//   if (err.status) {
//     return res
//     .status(err.status)
//     .send(err.errors[0].messages[0]);
//   }
//
//   if (err.output && err.output.statusCode) {
//     return res
//     .status(err.output.statusCode)
//     .set('Content-Type', 'text/plain')
//     .send(err.message);
//   }
//
//   console.error(err.stack);
//   res.sendStatus(500);
// });

module.exports = app;
