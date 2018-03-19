const router = require('express').Router();
const email = require('../controllers/emailController');
const mongoose = require('mongoose');

// NEW POST
router.post('/', email.send_email);

module.exports = router;
