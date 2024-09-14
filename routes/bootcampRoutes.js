const express = require('express');
const {
  getAllBootcamps,
  addBootcamps,
  updateBootcamp,
  deleteBootcamp,
  findBootcamp,
  getBootcampsInRadius,
} = require('../controllers/bootcampController');

// Include other resource router
const courseRouter = require('./courseRoutes');
const router = express.Router();

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/').get(getAllBootcamps).post(addBootcamps);
router
  .route('/:id')
  .get(findBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
