import express from "express";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import pdfParse from "pdf-parse";

dotenv.config();

const router = express.Router();

// ✅ Configure Multer for file uploads (storing in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ✅ Initialize Gemini AI only if key exists
let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "dummy_key") {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// ✅ Route to analyze job description or resume and generate interview questions
router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    let jobDescription = req.body.jobDescription || "";

    // ✅ Fallback if no API key
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

    // ✅ If a resume file is uploaded, extract text properly
    if (req.file) {
      console.log("✅ Resume file received");
      try {
        const pdfData = await pdfParse(req.file.buffer);
        jobDescription += `\n\nResume Content:\n${pdfData.text}`;
      } catch (pdfErr) {
        console.error("❌ Error parsing PDF:", pdfErr);
        return res.status(400).json({ error: "Failed to read uploaded PDF." });
      }
    }

    if (!jobDescription.trim()) {
      return res.status(400).json({ error: "Please provide a job description or upload a resume." });
    }

    // ✅ Create prompt for Gemini AI (generate exactly 5 questions)
    const prompt = `Generate exactly 5 mock interview questions based on the following job description and resume (if provided):\n\n${jobDescription}`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);

    // ✅ Extract AI-generated content
    const aiResponse = result?.response?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .join("\n");

    if (!aiResponse) {
      return res.status(500).json({ error: "Failed to generate questions from AI." });
    }

    // Split into lines, trim, and filter out empty lines
    const questions = aiResponse
      .split("\n")
      .map((q) => q.trim())
      .filter((q) => q !== "");

    // ✅ Limit to exactly 5 questions
    res.status(200).json({ questions: questions.slice(0, 5) });
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    res.status(500).json({ error: "Failed to generate interview questions." });
  }
});

export default router;
