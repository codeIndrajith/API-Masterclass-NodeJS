const BootcampModel = require('../models/bootcampModel');
const ErrorResponse = require('../utils/errorResponse');

// @desc     Get all bootcamps
// @route    GET /api/v1/bootcamps
// @access   Public

const getAllBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await BootcampModel.find({});
    res.json({ success: true, data: bootcamps });
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

// @desc     Find bootcamp
// @route    GET /api/v1/bootcamps/:id
// @access   Public
const findBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await BootcampModel.findById(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
};

// @desc     Add bootcamps
// @route    POST /api/v1/bootcamps
// @access   Private
const addBootcamps = async (req, res, next) => {
  try {
    await BootcampModel.create(req.body);
    res.json({ success: true, msg: 'Bootcamp create success' });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, msg: 'Bootcamp create fail', error: error });
  }
};

// @desc     Update bootcamp
// @route    PUT /api/v1/bootcamps/:id
// @access   Private
const updateBootcamp = async (req, res, next) => {
  const bootcamp = await BootcampModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!bootcamp) {
    res.status(404).json({ success: false, msg: 'Bootcamp Not Found' });
  } else {
    res
      .status(200)
      .json({ success: true, msg: 'Bootcamp Update Success', data: bootcamp });
  }
};

// @desc     Delete bootcamp
// @route    DELETE /api/v1/bootcamps/:id
// @access   Private
const deleteBootcamp = async (req, res, next) => {
  const bootcamp = await BootcampModel.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    res.status(404).json({ success: false, msg: 'Bootcamp Not Found' });
  } else {
    res.status(200).json({ success: true, msg: 'Bootcamp Delete Success' });
  }
};

module.exports = {
  getAllBootcamps,
  findBootcamp,
  addBootcamps,
  updateBootcamp,
  deleteBootcamp,
};
