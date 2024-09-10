const express = require('express');
const {
  getAllBootcamps,
  addBootcamps,
  updateBootcamp,
  deleteBootcamp,
  findBootcamp,
} = require('../controllers/bootcampController');
const router = express.Router();

router.route('/').get(getAllBootcamps).post(addBootcamps);
router
  .route('/:id')
  .get(findBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
