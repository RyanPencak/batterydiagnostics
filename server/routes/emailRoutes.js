/****************************************
* Ryan Pencak
* Bucknell University
* © 2018 Ryan Pencak ALL RIGHTS RESERVED
*****************************************/

const router = require('express').Router();
const email = require('../controllers/emailController');
const mongoose = require('mongoose');

// POST Request: post to email route with battery sends an email for that battery
router.post('/', email.send_email);

module.exports = router;
