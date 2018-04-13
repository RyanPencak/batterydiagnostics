// setup packages
const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const batteryData = require('./models/batteryDataModel');
const bodyParser = require('body-parser');
const axios = require('axios');

// define database url
const dburl = 'mongodb://ryanpencak:rvp224224@batteries-shard-00-00-rcuv5.mongodb.net:27017,batteries-shard-00-01-rcuv5.mongodb.net:27017,batteries-shard-00-02-rcuv5.mongodb.net:27017/test?ssl=true&replicaSet=batteries-shard-0&authSource=admin';

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
app.use('/api/email', require('./routes/emailRoutes'));

app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.use((req, res, next) => {
  const err = new Error('Not Found');

  err.status = 404;
  next(err);
});

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



// // HTTP Get Request
//
// const get_url = "https://batterydiagnostics.herokuapp.com/api/battery";
//
// function getBatteryData() {
//   return axios.get(get_url)
//     .then(response => {
//       // console.log(response.data[0]);
//       this.response = response.data;
//       return this.response;
//   })
// }
//
// // nodemailer transporter
// var transporter = nodemailer.createTransport({
//   // service: 'Gmail',
//   // auth: {
//   //   user: 'BatteryDiagnosticServer@gmail.com',
//   //   pass: 'fv!Y4R=cv=+6!Tw4,wpdyuRr'
//   // }
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true,
//   auth: {
//       user: 'BatteryDiagnosticServer@gmail.com',
//       pass: 'fv!Y4R=cv=+6!Tw4,wpdyuRr'
//   }
// });
//
// // function to send battery report
// function sendReport(email_contents) {
//   // set email data
//   var mailOptions = {
//       from: '"Battery Diagnostics Server" <BatteryDiagnosticServer@gmail.com>', // sender address
//       to: 'BatteryDiagnosticServer@gmail.com', // list of receivers
//       subject: 'Battery Report', // Subject line
//       text: email_contents // plain text body
//   };
//
//   // send mail with defined transport object
//   transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//           return console.log(error);
//       }
//       console.log('Message sent: %s', info.messageId);
//   });
// }
//
// // call getBatteryData and use data to send email
// getBatteryData()
//   .then(data => {
//     data = data.reverse();
//     new_post = data[0];
//     var email_contents = JSON.stringify(new_post);
//
//     if(! new_post.is_software)
//     {
//       sendReport(email_contents);
//     }
//     else if((new_post.measured_capacity/new_post.rated_capacity) < 0.40)
//     {
//       sendReport(email_contents);
//     }
//   });
//

// export module
