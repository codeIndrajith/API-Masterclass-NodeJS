const express = require('express');
const { getAllBootcamps } = require('../controllers/bootcampController');
const router = express.Router();

router.get('/', getAllBootcamps);

module.exports = router;
