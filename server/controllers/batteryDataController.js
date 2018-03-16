const mongoose = require('mongoose');
const Battery = mongoose.model('batteryData');

exports.list_all_batteries = function(req, res) {
  Battery.find({}, function(err, battery) {
    if (err)
      res.send(err);

    res.json(battery);
  });
};

// ORIGINAL CREATE_BATTERY
// exports.create_battery = function(req, res) {
//   var new_battery = new Battery(req.body);
//   new_battery.save(function(err, battery) {
//     if (err)
//       res.send(err);
//
//     res.json(battery);
//   });
// };

exports.create_battery = function(req, res) {
  var query = { serialNum: req.body.serialNum };
  var update = { "cycles": req.body.cycles, "dcVol": req.body.dcVol, "dcCur": req.body.dcCur, "dcCap": req.body.dcCap, "log_date": Date.now() };
  var options = { new: true, runValidators: true };
  Battery.findOneAndUpdate(query, update, options, function(err, battery) {
    if (err) {
      res.send(err);
    }

    else {

      if(!battery) {
        var battery = new Battery(req.body);
      }
      else {
        battery.mCap.push(req.body.mCap);
      }

      battery.save(function(err, bat) {
        if (err)
          res.send(err);

        res.json(bat);
      });
    }
  });
};

// exports.create_battery = function(req, res) {
//   var query = { serialNum: req.body.serialNum };
//   var modelDoc = new Battery(req.body);
//   var options = {upsert: true, new: true, runValidators: true};
//   Battery.findOneAndUpdate(query, modelDoc, options, function(err, battery){
//     if (err) {
//       res.send(err);
//     }
//
//     else {
//       // battery.set({ "_id": req.body._id, "cycles": req.body.cycles, "dcVol": req.body.dcVol, "dcCur": req.body.dcCur, "dcCap": req.body.dcCap, "log_date": req.body.log_date});
//       // battery.update({ _id: id }, { $set: { "cycles": req.params.cycles, "dcVol": req.params.dcVol, "dcCur": req.params.dcCur, "dcCap": req.params.dcCap, "log_date": req.params.log_date}});
//       battery.mCap.push(req.body.mCap);
//       res.json(battery);
//     }
//   });
// };

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
