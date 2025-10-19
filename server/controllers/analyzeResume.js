// controllers/analyzeResume.js
const pdfParse = require("pdf-parse");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

// OpenAI setup
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// ---------------------------
// Detect Job Role
// ---------------------------
const detectJobRole = async (req, res) => {
  try {
    const jobDescription = req.body.jobDescription || "";
    let resumeText = "";

    if (req.file) {
      const pdfData = await pdfParse(req.file.buffer);
      resumeText = pdfData.text;
    }

    // Prompt for AI to detect job role
    const prompt = `
You are an AI recruiter. Based on the following job description and resume content, detect the most suitable job role.

Job Description:
${jobDescription}

Resume Content:
${resumeText}

Respond with only the job role as plain text.
`;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const jobRole = response.data.choices[0].message.content.trim();

    res.json({ jobRole });
  } catch (err) {
    console.error("❌ Detect Job Role Error:", err);
    res.status(500).json({ error: "Failed to detect job role." });
  }
};

// ---------------------------
// Generate Questions
// ---------------------------
const generateQuestions = async (req, res) => {
  try {
    const { jobRole, jobDescription, resumeText, difficulty } = req.body;

    if (!jobRole) return res.status(400).json({ error: "Job role is required." });

    const prompt = `
You are an AI interview coach.
Generate 5 interview questions for a candidate applying for the role of "${jobRole}".
Use the following job description and resume for context:
Job Description: ${jobDescription || ""}
Resume Content: ${resumeText || ""}

Also provide a brief tip or feedback for each question.
Respond as JSON in the format:
{
  "questions": [
    {"question": "Question 1", "tip": "Tip 1"},
    {"question": "Question 2", "tip": "Tip 2"},
    ...
  ]
}
`;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const aiText = response.data.choices[0].message.content;
    const data = JSON.parse(aiText); // Expecting JSON format

    res.json(data);
  } catch (err) {
    console.error("❌ Generate Questions Error:", err);
    res.status(500).json({ error: "Failed to generate AI questions." });
  }
};

// ---------------------------
// Submit Answers & Give Feedback
// ---------------------------
const submitAnswers = async (req, res) => {
  try {
    const { answers, jobRole } = req.body;

    if (!answers || !Array.isArray(answers))
      return res.status(400).json({ error: "Answers must be an array." });

    // Prepare prompt for AI feedback
    const prompt = `
You are an AI interview coach.
The candidate applied for "${jobRole}".
Provide feedback on the following answers:

${answers.map((a, i) => `${i + 1}. ${a}`).join("\n")}

Respond as JSON:
{
  "feedback": [
    {"answer": "Answer 1", "feedback": "Feedback 1"},
    {"answer": "Answer 2", "feedback": "Feedback 2"},
    ...
  ]
}
`;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const aiText = response.data.choices[0].message.content;
    const data = JSON.parse(aiText);

    res.json(data);
  } catch (err) {
    console.error("❌ Submit Answers Error:", err);
    res.status(500).json({ error: "Failed to provide AI feedback." });
  }
};

module.exports = {
  detectJobRole,
  generateQuestions,
  submitAnswers,
};
