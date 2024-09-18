const asyncHandler = require('../middleware/async');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// @desc     Register user
// @route    POST /api/v1/auth/register
// @access   Public

const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Get the token
  const token = user.getSignedJwtToken();
  res.status(200).json({ success: true, token });
});

module.exports = { register };
