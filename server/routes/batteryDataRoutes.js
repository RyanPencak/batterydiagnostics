const router = require('express').Router();
const batteryData = require('../controllers/batteryDataController');

const mongoose = require('mongoose');
const Battery = mongoose.model('batteryData');

router.get('/', (req, res, next) => {
  Battery.find({}, function(err, battery) {
    if (err)
      res.send(err);

    res.json(battery);
  });
});

router.post('/', (req, res, next) => {
  var new_battery = new Battery(req.body);
  new_battery.save(function(err, battery) {
    if (err)
      res.send(err);

    res.json(battery);
  });
});

router.get('/:batteryId', (req, res, next) => {
  batteryData.read_battery});

router.delete('/:batteryId', (req, res, next) => {
  Battery.remove({_id: req.params.batteryId}, function(err, battery) {
    if (err)
      res.send(err);
    res.json({message: 'Battery Deleted'});
  });
})

module.exports = router;


// var batteryData = require('../controllers/batteryDataController');
//
// // Define Routes
// app.route('/battery')
//   .get(batteryData.list_all_batteries)
//   .post(batteryData.create_battery);
//
// app.route('/battery/:batteryId')
//   .get(batteryData.read_battery)
//   .put(batteryData.update_battery)
//   .delete(batteryData.delete_battery);
