const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getCurrentUserDetails,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logout,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/me').get(protect, getCurrentUserDetails);
router.route('/updatedetails').put(protect, updateDetails);
router.route('/updatepassword').put(protect, updatePassword);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:resettoken').put(resetPassword);

module.exports = router;
