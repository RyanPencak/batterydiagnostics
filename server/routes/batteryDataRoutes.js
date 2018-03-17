const router = require('express').Router();
const batteryData = require('../controllers/batteryDataController');
const mongoose = require('mongoose');
const Battery = mongoose.model('batteryData');

// NEW GET
router.get('/', batteryData.list_all_batteries);

// NEW POST
router.post('/', batteryData.create_battery);

// NEW GET BY ID
router.get('/:batteryId', batteryData.read_battery);

// NEW DELETE
router.delete('/:batteryId', batteryData.delete_battery);

module.exports = router;

// WORKING GET
// router.get('/', (req, res, next) => {
//   Battery.find({}, function(err, battery) {
//     if (err)
//       res.send(err);
//
//     res.json(battery);
//   });
// });

// WORKING POST
// router.post('/', (req, res, next) => {
//   var new_battery = new Battery(req.body);
//   new_battery.save(function(err, battery) {
//     if (err)
//       res.send(err);
//
//     res.json(battery);
//   });
// });

// WORKING GET BY ID
// router.get('/:batteryId', (req, res, next) => {
//   batteryData.read_battery});

// WORKING DELETE
// router.delete('/:batteryId', (req, res, next) => {
//   Battery.remove({_id: req.params.batteryId}, function(err, battery) {
//     if (err)
//       res.send(err);
//     res.json({message: 'Battery Deleted'});
//   });
// })


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
