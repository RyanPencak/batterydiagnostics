const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

exports.send_email = function(req, res) {
  // url
  const get_url = "https://batterydiagnostics.herokuapp.com/api/battery";

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

  // function to send battery report
  function sendReport(email_contents) {
    // set email data
    var mailOptions = {
        from: '"Battery Diagnostics Server" <BatteryDiagnosticServer@gmail.com>', // sender address
        to: 'BatteryDiagnosticServer@gmail.com', // list of receivers
        subject: 'Battery Report', // Subject line
        text: email_contents // plain text body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
  }

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

  const battery = req.body;

  if(! battery.is_software)
  {
    sendReport(JSON.stringify(battery));
  }
  else if((battery.mCap[battery.mCap.length - 1] / battery.rCap) < 0.40)
  {
    sendReport(JSON.stringify(battery));
  }

};
