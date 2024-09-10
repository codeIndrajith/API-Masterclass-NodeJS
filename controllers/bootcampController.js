const BootcampModel = require('../models/bootcampModel');

// @desc     Get all bootcamps
// @route    GET / .api/v1/bootcamps
// @access   Public

const getAllBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await BootcampModel.find({});
    res.json({ success: true, data: bootcamps });
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

// @desc     Add bootcamps
// @route    POST / .api/v1/bootcamps
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

module.exports = { getAllBootcamps, addBootcamps };
