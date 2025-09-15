const express = require('express');
const { startMockInterview } = require('../controllers/mockInterviewController');

const router = express.Router();

// ✅ Route for starting mock interview
router.post('/start', startMockInterview);

module.exports = router;
