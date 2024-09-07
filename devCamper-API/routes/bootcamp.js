const express = require('express');
const getAllBootcamps = require('../controllers/bootcamController');
const router = express.Router();

router.get('/', getAllBootcamps);

module.exports = router;
