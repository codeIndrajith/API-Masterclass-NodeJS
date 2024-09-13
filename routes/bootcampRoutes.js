const express = require('express');
const {
  getAllBootcamps,
  addBootcamps,
  updateBootcamp,
  deleteBootcamp,
  findBootcamp,
  getBootcampsInRadius,
} = require('../controllers/bootcampController');
const router = express.Router();

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/').get(getAllBootcamps).post(addBootcamps);
router
  .route('/:id')
  .get(findBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
