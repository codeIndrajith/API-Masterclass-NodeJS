const crypto = require('crypto');
const asyncHandler = require('../middleware/async');
const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');

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

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `Yot are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }

  await user.save({ validateBeforeSave: false });
  // res.status(200).json({ success: true, data: user });
});

// @desc     Reset password
// @route    PUT /api/v1/auth/resetpassword/:resettoken
// @access   Public

const resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed password
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');
  console.log(resetPasswordToken);

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid Token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc     Update user details
// @route    PUT /api/v1/auth/updatedetails
// @access   Private

const updateDetails = asyncHandler(async (req, res, next) => {
  const updateFields = {
    name: req.body.name,
    email: req.body.email,
  };
  const currentUser = await User.findByIdAndUpdate(req.user.id, updateFields, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: currentUser });
});

// @desc     Update user password
// @route    PUT /api/v1/auth/updatepassword
// @access   Private

const updatePassword = asyncHandler(async (req, res, next) => {
  const currentUser = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await currentUser.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  currentUser.password = req.body.newPassword;
  await currentUser.save();
  sendTokenResponse(currentUser, 200, res);
});

// @desc     Logout user
// @route    GET /api/v1/auth/logout
// @access   Private

const logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
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

module.exports = {
  register,
  login,
  getCurrentUserDetails,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logout,
};
