const BootcampModel = require('../models/bootcampModel');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const asyncHandler = require('../middleware/async');

// @desc     Get all bootcamps
// @route    GET /api/v1/bootcamps
// @access   Public

const getAllBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await BootcampModel.find({});
  res.json({ success: true, data: bootcamps });
});

// @desc     Find bootcamp
// @route    GET /api/v1/bootcamps/:id
// @access   Public
const findBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc     Add bootcamps
// @route    POST /api/v1/bootcamps
// @access   Private
const addBootcamps = asyncHandler(async (req, res, next) => {
  await BootcampModel.create(req.body);
  res.json({ success: true, msg: 'Bootcamp create success' });
});

// @desc     Update bootcamp
// @route    PUT /api/v1/bootcamps/:id
// @access   Private
const updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  } else {
    res.status(200).json({
      success: true,
      msg: 'Bootcamp Update Success',
      data: bootcamp,
    });
  }
});

// @desc     Delete bootcamp
// @route    DELETE /api/v1/bootcamps/:id
// @access   Private
const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  } else {
    res.status(200).json({ success: true, msg: 'Bootcamp Delete Success' });
  }
});

// @desc     Get Bootcamps withing a radius
// @route    GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access   Public
const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lon from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lon = loc[0].longitude;

  // Calc radius using radius
  // Divide distance by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;
  const bootcamps = await BootcampModel.find({
    location: { $geoWithin: { $centerSphere: [[lon, lat], radius] } },
  });

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

module.exports = {
  getAllBootcamps,
  findBootcamp,
  addBootcamps,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
};
