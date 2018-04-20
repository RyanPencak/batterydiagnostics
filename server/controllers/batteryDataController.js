/****************************************
* Ryan Pencak
* Bucknell University
* © 2018 Ryan Pencak ALL RIGHTS RESERVED
*****************************************/

const mongoose = require('mongoose');
const Battery = mongoose.model('batteryData');

// GET Function: get all batteries
exports.list_all_batteries = function(req, res) {
  Battery.find({}, null, {sort: {log_date: 'descending'}}, function(err, battery) {
    if (err) {
      res.send(err);
    }
    res.json(battery);
  });
};

// POST Function: post battery to create new or update existing battery
exports.create_battery = function(req, res) {
  var query = { serialNum: req.body.serialNum };
  var update = { "rCap": req.body.rCap, "laptopId": req.body.laptopId, "cycles": req.body.cycles, "is_windows": req.body.is_windows, "is_software": req.body.is_software, "isUpdated": true };
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
        if(req.body.dcVol != null) {
          battery.dcVol = req.body.dcVol;
        }
        if(req.body.dcCur != null) {
          battery.dcCur = req.body.dcCur;
        }
        if(req.body.dcCap != null) {
          battery.dcCap = req.body.dcCap;
        }
        battery.mCap.push(req.body.mCap);
        battery.log_date.push(Date.now());
      }


      battery.save(function(err, bat) {
        if (err)
          res.send(err);

        res.json(bat);
      });

    }
  });
};

// Get Battery By ID
exports.read_battery = function(req, res) {
  Battery.findById(req.params.batteryId, function(err, battery) {
    if (err)
      res.send(err);
    res.json(battery);
  });
};

// Basic update battery
exports.update_battery = function(req, res) {
  Battery.findOneAndUpdate({_id: req.params.batteryId}, req.body, {new: true}, function(err, battery) {
    if (err)
      res.send(err);
    res.json(battery);
  });
};

// Set isUpdated to false after checking battery on front-end
exports.reset_updates = function(req, res) {
  Battery.findOneAndUpdate({ isUpdated: true }, { "isUpdated": false }, function(err, battery) {
    if (err) {
      res.send(err);
    }
    res.json(battery);
  });
};

// Delete Battery from database
exports.delete_battery = function(req, res) {
  Battery.remove({_id: req.params.batteryId}, function(err, battery) {
    if (err)
      res.send(err);
    res.json({message: 'Battery Deleted'});
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

// DIFFERENT CREATE_BATTERY
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
