// @desc    Get all bootcamps
// @routes  /api/v1/bootcamps
// access   Public

const getAllBootcamps = (req, res, next) => {
  res.json({ success: true, msg: 'Send the all data' });
};

module.exports = getAllBootcamps;
