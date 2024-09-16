const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  deleteCourse,
  getCourses,
  getCourse,
  updateCourse,
  addCourse,
} = require('../controllers/courseController');

router.route('/').get(getCourses).post(addCourse);
router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
