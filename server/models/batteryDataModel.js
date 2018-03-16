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
  log_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('batteryData', BatteryDataSchema);
