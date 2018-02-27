var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BatteryDataSchema = new Schema({
  device_id: {
    type: String
  },
  serial_number: {
    type: String,
    required: 'enter battery id'
  },
  rated_capacity: {
    type: Number,
    required: 'enter expected battery capacity'
  },
  measured_capacity: {
    type: Number,
    required: 'enter current battery capacity'
  },
  cycle_count: {
    type: Number,
    required: 'enter charge cycle count'
  },
  charging_voltage: {
    type: Array
  },
  charging_current: {
    type: Array
  },
  charging_capacity: {
    type: Array
  },
  discharging_voltage: {
    type: Array
  },
  discharging_current: {
    type: Array
  },
  discharging_capacity: {
    type: Array
  },
  log_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('batteryData', BatteryDataSchema);
