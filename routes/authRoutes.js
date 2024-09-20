const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getCurrentUserDetails,
  forgotPassword,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/me').get(protect, getCurrentUserDetails);
router.route('/forgotpassword').post(forgotPassword);

module.exports = router;
