const express = require('express');
const {
  getAllBootcamps,
  addBootcamps,
  updateBootcamp,
  deleteBootcamp,
  findBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require('../controllers/bootcampController');

// Include other resource router
const courseRouter = require('./courseRoutes');
const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const Bootcamp = require('../models/bootcampModel');

const { protect } = require('../middleware/authMiddleware');

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getAllBootcamps)
  .post(protect, addBootcamps);
router
  .route('/:id')
  .get(findBootcamp)
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp);

router.route('/:id/photo').put(protect, bootcampPhotoUpload);

module.exports = router;
