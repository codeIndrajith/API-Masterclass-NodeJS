const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/ReviewModel');
const BootcampModel = require('../models/bootcampModel');
const Bootcamp = require('../controllers/bootcampController');

// @desc        Get Reviews
// @route       GET /api/v1/reviews
// @route       GET /api/v1/bootcamps/:bootcampId/review
// @access      Public

const getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc        Get Reviews
// @route       GET /api/v1/reviews/:id
// @access      Public

const getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!review) {
    return next(
      new ErrorResponse(`No review found with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc        Create Reviews
// @route       POST /api/v1/bootcamps/:bootcampId/reviews
// @access      Private

const addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await BootcampModel.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`)
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review,
  });
});

// @desc        Update Reviews
// @route       POST /api/v1/reviews/:id
// @access      Private

const updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`No review with the id of ${req.params.id}`));
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update review`, 401));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc        Delete Reviews
// @route       DELETE /api/v1/reviews/:id
// @access      Private

const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`No review with the id of ${req.params.id}`));
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update review`, 401));
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

module.exports = {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
};
