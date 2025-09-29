import express from "express";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import pdfParse from "pdf-parse";

dotenv.config();

const router = express.Router();

// ✅ Configure Multer for file uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ✅ Initialize Gemini AI only if key exists
let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "dummy_key") {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// ✅ Route: Upload resume and/or provide job description
router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    let jobDescription = req.body.jobDescription || "";

    // ✅ If a resume PDF is uploaded, extract text
    if (req.file) {
      console.log("✅ Resume uploaded, parsing PDF...");
      try {
        const pdfData = await pdfParse(req.file.buffer);
        jobDescription += `\n\nResume Content:\n${pdfData.text}`;
      } catch (pdfErr) {
        console.error("❌ Error parsing PDF:", pdfErr);
        return res.status(400).json({ error: "Failed to read uploaded PDF." });
      }
    }

    // ✅ Validate input
    if (!jobDescription.trim()) {
      return res.status(400).json({ error: "Please upload a resume or provide a job description." });
    }

    // ✅ If no Gemini API key, use random fallback questions
    if (!genAI) {
      const fallbackQuestionsPool = [
        "Tell me about yourself.",
        "What motivates you?",
        "Why should we hire you?",
        "Describe a challenging project you worked on.",
        "Where do you see yourself in 5 years?",
        "How do you handle stress?",
        "Give an example of teamwork.",
        "What is your biggest weakness?",
        "How do you prioritize tasks?",
        "Describe a leadership experience."
      ];

      const questions = [];
      while (questions.length < 5) {
        const q = fallbackQuestionsPool[Math.floor(Math.random() * fallbackQuestionsPool.length)];
        if (!questions.includes(q)) questions.push(q);
      }

      return res.status(200).json({ questions });
    }

    // ✅ Generate prompt for Gemini AI
    const prompt = `Generate exactly 5 mock interview questions based on the following job description and resume content:\n\n${jobDescription}`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);

    // ✅ Extract AI-generated content
    const aiResponse = result?.response?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .join("\n");

    if (!aiResponse) {
      return res.status(500).json({ error: "Failed to generate questions from AI." });
    }

    const questions = aiResponse
      .split("\n")
      .map(q => q.trim())
      .filter(q => q !== "")
      .slice(0, 5); // limit to 5 questions

    res.status(200).json({ questions });

  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ error: "Failed to generate interview questions." });
  }
});

export default router;
