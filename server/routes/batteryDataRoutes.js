/****************************************
* Ryan Pencak
* Bucknell University
* © 2018 Ryan Pencak ALL RIGHTS RESERVED
*****************************************/

const router = require('express').Router();
const batteryData = require('../controllers/batteryDataController');
const mongoose = require('mongoose');
const Battery = mongoose.model('batteryData');

// GET Request: get all battery data
router.get('/', batteryData.list_all_batteries);

// POST Request: post battery
router.post('/', batteryData.create_battery);

// Get with ID Param: get battery with given ID
router.get('/:batteryId', batteryData.read_battery);

// PATCH Request: set isUpdated to false for that battery
router.patch('/:batteryId', batteryData.reset_updates);

// DELETE Request: remove specified battery from the database
router.delete('/:batteryId', batteryData.delete_battery);

module.exports = router;




/* Old Methods */

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
