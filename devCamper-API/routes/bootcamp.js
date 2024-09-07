const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, msg: 'Send the all data' });
});

module.exports = router;
