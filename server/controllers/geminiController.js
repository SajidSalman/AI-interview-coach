import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";
import pdfParse from "pdf-parse";

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
    // Fallback if no API key
    if (!genAI) {
      console.log("⚠️ Using fallback data. No Gemini API key found.");
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

    // ----- ⬇️ 1. THIS IS THE FIX: Forcing API version 'v1' ⬇️ -----
    const model = genAI.getGenerativeModel({ model: "gemini-pro", apiVersion: "v1" });
    // ----- ⬆️ 1. THIS IS THE FIX ⬆️ -----

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

    // Save to MongoDB
    if (qaPairs.length > 0 && userEmail) {
      const user = await User.findOne({ email: userEmail });
      
      if (user) {
        const newInterviewSession = new InterviewQA({
          user: user._id,
          jobDescription: jobDescription || "N/A",
          roleLevel: roleLevel || "N/A",
          qaPairs: qaPairs,
        });
        
        await newInterviewSession.save();
        console.log("✅ Successfully saved Q&A session to MongoDB.");
      } else {
        console.warn(`⚠️ Warning: Could not find user with email ${userEmail}. Q&A session not saved.`);
      }
    }

    return res.status(200).json({ qaPairs });
  } catch (error) {
    console.error("❌ Gemini Analysis Error:", error);
    return res.status(500).json({ error: "Error generating questions and answers" });
  }
};

// -------------------- GET FEEDBACK ON ANSWERS --------------------
export const getFeedback = async (req, res) => {
  try {
    const { answers } = req.body; // Expects: { answers: [{ questionId, questionText, answerText }] }

    // Fallback if no API key
    if (!genAI) {
      console.log("⚠️ Using fallback data. No Gemini API key found for feedback.");
      const fallbackFeedback = answers.map(ans => ({
        questionId: ans.questionId,
        feedback: "This is a placeholder feedback. Configure your Gemini API key to get real analysis."
      }));
      return res.status(200).json({ feedback: fallbackFeedback });
    }

    // ----- ⬇️ 2. THIS IS THE FIX: Forcing API version 'v1' ⬇️ -----
    const model = genAI.getGenerativeModel({ model: "gemini-pro", apiVersion: "v1" });
    // ----- ⬆️ 2. THIS IS THE FIX ⬆️ -----

    const feedbackPromises = [];

    // Loop over each answer and create a new API call promise
    for (const ans of answers) {
      const prompt = `
You are an AI Interview Coach. A user was asked the following interview question:
Question: "${ans.questionText}"

The user provided this answer:
Answer: "${ans.answerText || "(No answer provided)"}"

Please provide constructive feedback on this answer. Focus on what was good and what could be improved. Be concise and helpful.
`;

      const promise = model.generateContent(prompt).then(result => {
        return {
          questionId: ans.questionId,
          feedback: result.response.text().trim()
        };
      });

      feedbackPromises.push(promise);
    }

    // Wait for all feedback requests to complete
    const feedback = await Promise.all(feedbackPromises);

    return res.status(200).json({ feedback });

  } catch (error) {
    console.error("❌ Gemini Feedback Error:", error);
    return res.status(500).json({ error: "Error generating feedback" });
  }
};