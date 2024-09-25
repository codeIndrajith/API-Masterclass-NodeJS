const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  deleteCourse,
  getCourses,
  getCourse,
  updateCourse,
  addCourse,
} = require('../controllers/courseController');

const Course = require('../models/courseModel');
const advancedResults = require('../middleware/advancedResults');

const { protect, authorize } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(
    advancedResults(Course, {
      // Populate is working find the bootcamps include to courses
      path: 'bootcamp',
      select: 'name description',
    }),
    getCourses
  )
  .post(protect, authorize('publisher', 'admin'), addCourse);
router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('publisher', 'admin'), updateCourse)
  .delete(protect, authorize('publisher', 'admin'), deleteCourse);

module.exports = router;
