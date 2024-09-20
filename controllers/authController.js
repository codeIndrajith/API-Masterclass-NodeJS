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

  sendTokenResponse(user, 200, res);
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

  sendTokenResponse(user, 200, res);
});

// @desc     Get logged user details
// @route    GET /api/v1/auth/me
// @access   Private

const getCurrentUserDetails = asyncHandler(async (req, res, next) => {
  const currentUser = await User.findById(req.user);
  res.status(200).json({ success: true, data: currentUser });
});

// @desc     Forgot password
// @route    GET /api/v1/auth/forgotpassword
// @access   Public

const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset toke
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });
  res.status(200).json({ success: true, data: user });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const option = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, option).json({
    success: true,
    token,
  });
};

module.exports = { register, login, getCurrentUserDetails, forgotPassword };
