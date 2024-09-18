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
  .post(addCourse);
router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
