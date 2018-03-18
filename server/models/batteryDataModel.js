var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BatteryDataSchema = new Schema({
  serialNum: {
    type: String,
    required: 'enter battery serial number'
  },
  laptopId: {
    type: String
  },
  rCap: {
    type: Number,
    required: 'enter expected battery capacity'
  },
  mCap: {
    type: Array,
    required: 'enter current battery capacity'
  },
  cycles: {
    type: Number,
    required: 'enter charge cycle count'
  },
  dcVol: {
    type: Array
  },
  dcCur: {
    type: Array
  },
  dcCap: {
    type: Array
  },
  is_software: {
    type: Boolean,
    default: false
  },
  is_windows: {
    type: Boolean,
    default: false
  },
  log_date: {
    type: Date,
    default: Date.now()
  }
});

// function formatDate(date) {
//   var monthNames = [
//     "January", "February", "March",
//     "April", "May", "June", "July",
//     "August", "September", "October",
//     "November", "December"
//   ];
//
//   var day = date.getDate();
//   var monthIndex = date.getMonth();
//   var year = date.getFullYear();
//
//   return day + ' ' + monthNames[monthIndex] + ' ' + year;
// }

module.exports = mongoose.model('batteryData', BatteryDataSchema);
