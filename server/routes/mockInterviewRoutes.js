// server/routes/mockInterviewRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import pdfParse from "pdf-parse";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const router = express.Router();

// ---------------------------
// 1️⃣ Configure Multer for resume uploads (memory storage)
// ---------------------------
const storageMemory = multer.memoryStorage();
const uploadMemory = multer({ storage: storageMemory });

// ---------------------------
// 2️⃣ Initialize OpenAI GPT
// ---------------------------
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "dummy_key") {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  console.log("✅ OpenAI GPT initialized");
} else {
  console.log("⚠️ OPENAI_API_KEY missing; fallback questions will be used");
}

// ---------------------------
// 3️⃣ Route: Analyze job description or resume
// ---------------------------
router.post("/analyze", uploadMemory.single("resume"), async (req, res) => {
  try {
    let jobDescription = req.body.jobDescription || "";
    let resumeText = "";

    if (req.file) {
      const pdfData = await pdfParse(req.file.buffer);
      resumeText = pdfData.text;
      jobDescription += `\n\nResume Content:\n${resumeText}`;
    }

    if (!jobDescription.trim()) {
      return res.status(400).json({
        error: "Please provide a job description or upload a resume.",
      });
    }

    // Fallback questions if OpenAI is not available
    if (!openai) {
      return res.status(200).json({
        questions: [
          { question: "Tell me about yourself.", tip: "Highlight your strengths and experience." },
          { question: "Why are you interested in this role?", tip: "Show alignment with company goals." },
          { question: "Describe a challenging project you worked on.", tip: "Focus on problem-solving skills." },
          { question: "What are your strengths and weaknesses?", tip: "Be honest but strategic." },
          { question: "Where do you see yourself in 5 years?", tip: "Show ambition and growth plans." },
        ],
      });
    }

    const prompt = `
You are an AI interview coach.
Based on the following job description and resume, generate exactly 5 interview questions.
Also provide a brief tip for each question.

Job Description + Resume:
${jobDescription}

Return your response as JSON:
{
  "questions": [
    {"question": "Question 1", "tip": "Tip 1"},
    {"question": "Question 2", "tip": "Tip 2"},
    {"question": "Question 3", "tip": "Tip 3"},
    {"question": "Question 4", "tip": "Tip 4"},
    {"question": "Question 5", "tip": "Tip 5"}
  ]
}
`;

    let questions = [];
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      const aiText = response.choices[0].message.content;
      const data = JSON.parse(aiText);
      questions = data.questions || [];
    } catch (err) {
      console.warn("⚠️ Failed to generate AI questions, using fallback:", err);
      questions = [
        { question: "Tell me about yourself.", tip: "" },
        { question: "What are your strengths?", tip: "" },
        { question: "Why should we hire you?", tip: "" },
        { question: "Describe a challenging project.", tip: "" },
        { question: "Where do you see yourself in 5 years?", tip: "" },
      ];
    }

    res.status(200).json({ questions });
  } catch (error) {
    console.error("❌ OpenAI API Error:", error);
    res.status(500).json({ error: "Failed to generate interview questions." });
  }
});

// ---------------------------
// 4️⃣ Configure Multer for audio/video answers (disk storage)
// ---------------------------
const answersDir = path.join(process.cwd(), "uploads", "answers");
if (!fs.existsSync(answersDir)) fs.mkdirSync(answersDir, { recursive: true });

const storageDisk = multer.diskStorage({
  destination: (req, file, cb) => cb(null, answersDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const uploadDisk = multer({
  storage: storageDisk,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("audio/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only audio and video files are allowed!"));
    }
  },
});

// ---------------------------
// 5️⃣ Route: Submit audio/video answers with optional AI feedback
// ---------------------------
router.post("/submit-answer", uploadDisk.array("mediaFiles"), async (req, res) => {
  try {
    const files = req.files || [];
    let textAnswers = [];

    if (req.body.textAnswers) {
      try {
        if (Array.isArray(req.body.textAnswers)) {
          textAnswers = req.body.textAnswers.map((t) => JSON.parse(t));
        } else {
          textAnswers = [JSON.parse(req.body.textAnswers)];
        }
      } catch (err) {
        console.warn("⚠️ Failed to parse textAnswers JSON:", err);
        textAnswers = [];
      }
    }

    let feedback = [];

    if (textAnswers.length > 0 && openai) {
      try {
        const feedbackPrompt = `
You are an AI interview coach.
The candidate provided the following answers:
${textAnswers.map((a, i) => `${i + 1}. ${a.text || a}`).join("\n")}

Provide brief feedback for each answer in JSON:
{
  "feedback": [
    {"answer": "Answer 1", "feedback": "Feedback 1"},
    {"answer": "Answer 2", "feedback": "Feedback 2"},
    {"answer": "Answer 3", "feedback": "Feedback 3"},
    {"answer": "Answer 4", "feedback": "Feedback 4"},
    {"answer": "Answer 5", "feedback": "Feedback 5"}
  ]
}
`;

        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: feedbackPrompt }],
          temperature: 0.7,
        });

        const aiText = response.choices[0].message.content;
        const data = JSON.parse(aiText);
        feedback = data.feedback || [];
      } catch (err) {
        console.warn("⚠️ Failed to generate AI feedback:", err);
      }
    }

    const metadata = {
      textAnswers,
      feedback,
      files: files.map((f) => ({
        filename: f.filename,
        path: f.path,
        mimetype: f.mimetype,
      })),
      submittedAt: new Date(),
    };

    res.json({ success: true, metadata });
  } catch (err) {
    console.error("❌ Submit Answer Error:", err);
    res.status(500).json({ error: "Failed to save answers." });
  }
});

export default router;
