const BootcampModel = require('../models/bootcampModel');

// @desc     Get all bootcamps
// @route    GET / .api/v1/bootcamps
// @access   Public

const getAllBootcamps = async (req, res) => {
  try {
    const bootcamps = await BootcampModel.find({});
    res.json({ success: true, data: bootcamps });
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

module.exports = { getAllBootcamps };
