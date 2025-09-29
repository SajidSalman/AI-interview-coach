import express from "express";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();
const router = express.Router();

// ---------------------------
// 1️⃣ Configure Multer for resume uploads (in memory)
// ---------------------------
const storageMemory = multer.memoryStorage();
const uploadMemory = multer({ storage: storageMemory });

// ---------------------------
// 2️⃣ Initialize Gemini AI
// ---------------------------
let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "dummy_key") {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// ---------------------------
// 3️⃣ Route: Analyze job description or resume
// ---------------------------
router.post("/analyze", uploadMemory.single("resume"), async (req, res) => {
  try {
    let jobDescription = req.body.jobDescription || "";

    // Append resume text if uploaded
    if (req.file) {
      console.log("✅ Resume file received");
      jobDescription += `\n\nResume Content:\n${req.file.buffer.toString("utf-8")}`;
    }

    if (!jobDescription.trim()) {
      return res.status(400).json({ error: "Please provide a job description or upload a resume." });
    }

    // If no API key, return fallback questions
    if (!genAI) {
      return res.status(200).json({
        questions: [
          "Tell me about yourself.",
          "What are your strengths?",
          "Why should we hire you?",
          "Describe a challenging project you worked on.",
          "Where do you see yourself in 5 years?",
        ],
      });
    }

    // Prompt for AI
    const prompt = `Based on the following job description and resume (if provided), generate 5 mock interview questions:\n\n${jobDescription}`;
    console.log("🔹 Prompt sent to Gemini AI:\n", prompt);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);

    const aiResponse = result?.response?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .join("\n");

    if (!aiResponse) {
      console.error("❌ AI Response Error: Empty response");
      return res.status(500).json({ error: "Failed to generate questions from AI." });
    }

    const questions = aiResponse
      .split("\n")
      .map((q) => q.trim())
      .filter((q) => q !== "");

    if (questions.length === 0) {
      console.error("❌ No questions generated");
      return res.status(500).json({ error: "AI failed to generate valid questions." });
    }

    console.log("✅ Generated Questions:\n", questions);
    res.status(200).json({ questions });
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    res.status(500).json({ error: "Failed to generate interview questions." });
  }
});

// ---------------------------
// 4️⃣ Configure Multer for audio/video answers (disk storage)
// ---------------------------
const answersDir = path.join(process.cwd(), "uploads", "answers");
if (!fs.existsSync(answersDir)) {
  fs.mkdirSync(answersDir, { recursive: true });
  console.log(`✅ Created 'uploads/answers' directory`);
}

const storageDisk = multer.diskStorage({
  destination: (req, file, cb) => cb(null, answersDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const uploadDisk = multer({
  storage: storageDisk,
  fileFilter: (req, file, cb) => {
    // Accept audio and video files only
    if (
      file.mimetype.startsWith("audio/") ||
      file.mimetype.startsWith("video/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only audio and video files are allowed!"));
    }
  },
});

// ---------------------------
// 5️⃣ Route: Submit audio/video answer
// ---------------------------
router.post("/submit-answer", uploadDisk.single("answer"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    console.log("✅ Answer file received:", req.file.path);

    // Optionally capture metadata
    const metadata = {
      questionId: req.body.questionId || null,
      userId: req.body.userId || null,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      uploadedAt: new Date(),
    };

    // For now, we just return metadata (you can save to DB later)
    res.json({ success: true, metadata });
  } catch (err) {
    console.error("❌ Submit Answer Error:", err);
    res.status(500).json({ error: "Failed to save answer" });
  }
});

export default router;
