const mongoose = require('mongoose');
const Battery = mongoose.model('batteryData');

exports.list_all_batteries = function(req, res) {
  Battery.find({}, function(err, battery) {
    if (err)
      res.send(err);

    res.json(battery);
  });
};

exports.create_battery = function(req, res) {
  var new_battery = new Battery(req.body);
  new_battery.save(function(err, battery) {
    if (err)
      res.send(err);

    res.json(battery);
  });
};

exports.read_battery = function(req, res) {
  Battery.findById(req.params.batteryId, function(err, battery) {
    if (err)
      res.send(err);
    res.json(battery);
  });
};

exports.update_battery = function(req, res) {
  Battery.findOneAndUpdate({_id: req.params.batteryId}, req.body, {new: true}, function(err, battery) {
    if (err)
      res.send(err);
    res.json(battery);
  });
};

exports.delete_battery = function(req, res) {
  Battery.remove({_id: req.params.batteryId}, function(err, battery) {
    if (err)
      res.send(err);
    res.json({message: 'Battery Deleted'});
  });
};
