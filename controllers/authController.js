const asyncHandler = require('../middleware/async');
const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');

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

// @desc     Login user
// @route    POST /api/v1/auth/register
// @access   Public

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Get the token
  const token = user.getSignedJwtToken();
  res.status(200).json({ success: true, token });
});

module.exports = { register, login };
