const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/submit', upload.single('video'), async (req, res) => {
  try {
    const videoBuffer = req.file.buffer;
    const question = req.body.question;

    // Process the video and question
    console.log("Question:", question);
    console.log("Received video:", videoBuffer);

    // Simulate AI-based analysis (replace this with actual logic)
    const analysis = `You need to work on confidence while answering '${question}'.`;

    res.status(200).json({ analysis });
  } catch (error) {
    console.error('Error submitting interview:', error);
    res.status(500).json({ error: 'Failed to process interview' });
  }
});

module.exports = router;
