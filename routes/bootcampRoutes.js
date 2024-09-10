const express = require('express');
const {
  getAllBootcamps,
  addBootcamps,
} = require('../controllers/bootcampController');
const router = express.Router();

router.route('/').get(getAllBootcamps).post(addBootcamps);

module.exports = router;
