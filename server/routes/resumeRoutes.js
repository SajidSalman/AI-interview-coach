import express from "express";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
 
// ✅ Configure Multer for file uploads (storing in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ✅ Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Route to analyze job description or resume and generate interview questions
router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    let jobDescription = req.body.jobDescription || "";

    // ✅ If a resume file is uploaded, convert buffer to text
    if (req.file) {
      console.log("✅ Resume file received");
      jobDescription += `\n\nResume Content:\n${req.file.buffer.toString("utf-8")}`;
    }

    if (!jobDescription.trim()) {
      return res.status(400).json({ error: "Please provide a job description or upload a resume." });
    }

    console.log("🔹 Job Description:\n", jobDescription);

    // ✅ Create a prompt for Gemini AI
    const prompt = `Based on the following job description and resume (if provided), generate 5 mock interview questions:\n\n${jobDescription}`;
    console.log("🔹 Prompt sent to Gemini:\n", prompt);

    // ✅ Call Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);

    // ✅ Correct path to extract AI-generated content
    const aiResponse = result?.response?.candidates?.[0]?.content?.parts?.map(part => part.text).join("\n");

    if (!aiResponse) {
      console.error("❌ AI Response Error: Empty response");
      return res.status(500).json({ error: "Failed to generate questions from AI." });
    }

    console.log("✅ AI Response:\n", aiResponse);

    // ✅ Split into separate questions (by newline or punctuation)
    const questions = aiResponse
      .split("\n")
      .map(q => q.trim())
      .filter(q => q !== "");

    if (questions.length === 0) {
      console.error("❌ No questions generated");
      return res.status(500).json({ error: "AI failed to generate valid questions." });
    }

    // ✅ Send generated questions as response
    console.log("✅ Generated Questions:\n", questions);
    res.status(200).json({ questions });

  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    res.status(500).json({ error: "Failed to generate interview questions." });
  }
});

export default router; // Export the router as a default export
