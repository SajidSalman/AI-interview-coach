const express = require('express');
const router = express.Router();
const multer = require('multer');
const analyzeResume = require('../controllers/analyzeResume');

const upload = multer();

router.post('/detect-role', upload.single('file'), analyzeResume.detectRole);
router.post('/generate-questions', analyzeResume.generateQuestions);
router.post('/submit-answers', analyzeResume.submitAnswers);

module.exports = router;
