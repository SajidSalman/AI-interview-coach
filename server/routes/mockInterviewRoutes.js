// server/routes/mockInterviewRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import pdfParse from "pdf-parse";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const router = express.Router();

// ---------------------------
// 1️⃣ Multer for resume uploads (memory storage)
// ---------------------------
const storageMemory = multer.memoryStorage();
const uploadMemory = multer({ storage: storageMemory });

// ---------------------------
// 2️⃣ Initialize Gemini AI (service account auth handles OAuth)
// ---------------------------
let genAI = null;
try {
  genAI = new GoogleGenerativeAI();
  console.log("✅ Gemini AI initialized with service account");
} catch (err) {
  console.error("❌ Gemini AI initialization failed:", err);
}

// ---------------------------
// 3️⃣ Route: Generate mock interview questions
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
      return res.status(400).json({ error: "Please provide a job description or upload a resume." });
    }

    if (!genAI) {
      return res.status(500).json({ error: "Gemini AI not initialized" });
    }

    // Gemini prompt
    const prompt = `Generate exactly 5 mock interview questions with short tips for this job description (and resume if included):\n\n${jobDescription}`;

    // Get model (use latest supported model)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-t" });

    const result = await model.generateContent(prompt);

    const aiResponse = result?.response?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .join("\n");

    const questions = aiResponse
      ? aiResponse
          .split("\n")
          .map((q) => q.trim())
          .filter((q) => q)
          .slice(0, 5)
          .map((q) => ({ question: q, tip: "Answer confidently and relate it to the job." }))
      : [];

    res.status(200).json({ questions });
  } catch (err) {
    console.error("❌ /analyze Error:", err);
    res.status(500).json({ error: "Failed to generate interview questions." });
  }
});

// ---------------------------
// 4️⃣ Multer for audio/video answers (disk storage)
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
    if (file.mimetype.startsWith("audio/") || file.mimetype.startsWith("video/")) cb(null, true);
    else cb(new Error("Only audio and video files are allowed!"));
  },
});

// ---------------------------
// 5️⃣ Submit answers route
// ---------------------------
router.post("/submit-answer", uploadDisk.array("mediaFiles"), async (req, res) => {
  try {
    const files = req.files || [];
    let textAnswers = [];

    if (req.body.textAnswers) {
      textAnswers = Array.isArray(req.body.textAnswers)
        ? req.body.textAnswers.map((t) => JSON.parse(t))
        : [JSON.parse(req.body.textAnswers)];
    }

    const metadata = { textAnswers, files, submittedAt: new Date() };
    console.log("💾 Answers submitted:", metadata);

    res.json({ success: true, metadata });
  } catch (err) {
    console.error("❌ /submit-answer Error:", err);
    res.status(500).json({ error: "Failed to save answers." });
  }
});

// ---------------------------
// 6️⃣ Review answers route (Gemini feedback)
// ---------------------------
router.post("/review-answers", async (req, res) => {
  try {
    const { textAnswers } = req.body;
    if (!textAnswers?.length) return res.status(400).json({ error: "No answers provided." });

    if (!genAI) return res.status(500).json({ error: "Gemini AI not initialized." });

    const prompt = `You are an expert interviewer. Review the following answers and give brief feedback for each:\n\n${JSON.stringify(textAnswers, null, 2)}`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-t" });
    const result = await model.generateContent(prompt);

    const aiResponse = result?.response?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .join("\n");

    const feedback = textAnswers.map((a, idx) => ({
      questionId: a.questionId,
      feedback: aiResponse ? aiResponse.split("\n")[idx] || "No feedback provided." : "No feedback generated.",
    }));

    res.status(200).json({ feedback });
  } catch (err) {
    console.error("❌ /review-answers Error:", err);
    res.status(500).json({ error: "Failed to generate feedback." });
  }
});

export default router;
