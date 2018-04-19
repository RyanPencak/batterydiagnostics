/****************************************
* Ryan Pencak
* Bucknell University
* © 2018 Ryan Pencak ALL RIGHTS RESERVED
*****************************************/

const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');

exports.send_email = function(req, res) {
  // url
  const get_url = "https://batterydiagnostics.herokuapp.com/api/battery";

  // read html template email
  var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
  };

  // nodemailer transporter
  var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'BatteryDiagnosticServer@gmail.com',
        pass: 'fv!Y4R=cv=+6!Tw4,wpdyuRr'
    }
  });

  // set battery to request body
  const battery = req.body;

  // if battery is tested with hardware, send completed test email
  if(! battery.is_software)
  {
    // read HTML email template and replace variables with battery data
    readHTMLFile(__dirname + '/templates/completedTestEmail.html', function(err, html) {
      var template = handlebars.compile(html);
      var replacements = {
           serialNum: battery.serialNum,
           percentCap: ((battery.mCap[battery.mCap.length-1]/battery.rCap)*100).toFixed(2),
           rCap: battery.rCap,
           mCap: battery.mCap[battery.mCap.length-1],
           cycles: battery.cycles
      };

      // set html template with variables
      var htmlToSend = template(replacements);

      // set mail options
      var mailOptions = {
          from: '"Battery Diagnostics Server" <BatteryDiagnosticServer@gmail.com>', // sender address
          to: 'ryanpencak@gmail.com', // list of receivers
          subject: 'Battery Test Complete', // Subject line
          html: htmlToSend
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message sent: %s', info.messageId);
      });
    });
  }

  // if battery is tested with software and below 40% maximum capacity, send failing battery alert email
  else if((battery.mCap[battery.mCap.length - 1] / battery.rCap) < 0.40)
  {
    // read HTML email template and replace variables with battery data
    readHTMLFile(__dirname + '/templates/flaggedBatteryEmail.html', function(err, html) {
      var template = handlebars.compile(html);
      var replacements = {
           serialNum: battery.serialNum,
           laptopId: battery.laptopId,
           percentCap: ((battery.mCap[battery.mCap.length-1]/battery.rCap)*100).toFixed(2),
           rCap: battery.rCap,
           mCap: battery.mCap[battery.mCap.length-1],
           cycles: battery.cycles
      };

      // set html template with variables
      var htmlToSend = template(replacements);

      // set mail options
      var mailOptions = {
          from: '"Battery Diagnostics Server" <BatteryDiagnosticServer@gmail.com>', // sender address
          to: 'ryanpencak@gmail.com', // list of receivers
          subject: 'Battery Flagged', // Subject line
          html: htmlToSend
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message sent: %s', info.messageId);
      });
    });
  }

};



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

// call getBatteryData and use data to send email
// console.log(req.body);
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
