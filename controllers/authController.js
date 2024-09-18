const asyncHandler = require('../middleware/async');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// @desc     Register user
// @route    POST /api/v1/auth/register
// @access   Public

const register = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true });
});

module.exports = { register };
