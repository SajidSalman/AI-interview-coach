import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";
import pdfParse from "pdf-parse";   // ✅ FIXED IMPORT

import InterviewQA from "../models/InterviewQA.js";
import User from "../models/User.js";

// -------------------- INIT GEMINI --------------------
let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "dummy_key") {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// -------------------- ANALYZE RESUME OR JD + GENERATE QUESTIONS AND ANSWERS --------------------
export const analyzeResumeOrJD = async (req, res) => {
  try {
    // ✅ Fallback if no API key
    if (!genAI) {
      return res.status(200).json({
        qaPairs: [
          { question: "Tell me about yourself.", answer: "I am a dedicated candidate eager to learn." },
          { question: "What is your biggest strength?", answer: "I adapt quickly and solve problems efficiently." },
        ],
      });
    }

    const { jobDescription, roleLevel = "N/A", userEmail } = req.body;
    const resumeFile = req.file;

    let resumeText = "";
    if (resumeFile && resumeFile.buffer) {
      const pdfData = await pdfParse(resumeFile.buffer);
      resumeText = pdfData.text;
    }

    const prompt = `
You are an AI Interview Coach. Based on the following resume and job description, generate 8-10 interview question-answer pairs. Include both technical and behavioral questions. Format response as:

Q: <Question>
A: <Model Answer>

Resume:
${resumeText || "N/A"}

Job Description:
${jobDescription || "N/A"}
`;

    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro-latest" });
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse QA pairs
    const qaPairs = [];
    const lines = response.split("\n");

    let currentQuestion = "";
    let currentAnswer = "";

    lines.forEach((line) => {
      line = line.trim();

      if (/^Q[:：]/i.test(line)) {
        if (currentQuestion && currentAnswer) {
          qaPairs.push({ question: currentQuestion, answer: currentAnswer });
          currentAnswer = "";
        }
        currentQuestion = line.replace(/^Q[:：]\s*/i, "");
      } else if (/^A[:：]/i.test(line)) {
        currentAnswer = line.replace(/^A[:：]\s*/i, "");
      } else if (currentAnswer !== "") {
        currentAnswer += " " + line; // multi-line answers
      }
    });

    // Push last one
    if (currentQuestion && currentAnswer) {
      qaPairs.push({ question: currentQuestion, answer: currentAnswer });
    }

    return res.status(200).json({ qaPairs });
  } catch (error) {
    console.error("❌ Gemini Analysis Error:", error);
    return res.status(500).json({ error: "Error generating questions and answers" });
  }
};
