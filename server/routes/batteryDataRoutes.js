const router = require('express').Router();
const batteryData = require('../controllers/batteryDataController');

router.get('/', (req, res, next) => {
  batteryData.list_all_batteries});

router.get('/:batteryId', (req, res, next) => {
  batteryData.read_battery});

module.exports = router;


//   var batteryData = require('../controllers/batteryDataController');
//
//   // Define Routes
//   app.route('/batteryData')
//     .get(batteryData.list_all_batteries)
//     .post(batteryData.create_battery);
//
//   app.route('/batteryData/:batteryId')
//     .get(batteryData.read_battery)
//     .put(batteryData.update_battery)
//     .delete(batteryData.delete_battery);
// };
