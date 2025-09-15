import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export const analyzeResume = async (req, res) => {
  try {
    console.log("➡️ Request Received:", req.body);

    let input = "";

    // ✅ Dynamically import pdf-parse only when needed
    if (req.file) {
      console.log("✅ Received file:", req.file.originalname);
      const { default: pdfParse } = await import("pdf-parse");
      const data = await pdfParse(req.file.buffer);
      input = data.text;
    } else if (req.body.input) {
      input = req.body.input;
    } else {
      return res.status(400).json({ error: "No input provided" });
    }

    if (!input) {
      throw new Error("Failed to extract text from input");
    }

    console.log("✅ Extracted input:", input.slice(0, 500), "..."); // log only first 500 chars

    // ✅ Prompt for Gemini
    const prompt = `
Based on the following resume or input, generate 10 interview questions:
- If the candidate is from a technical background:
  - Generate 5 technical questions about their skills, projects, and technologies.
  - Generate 5 behavioral questions about problem-solving, teamwork, and communication.
- If non-technical: generate 5 general questions.

Input:
${input}

Only return the questions in a numbered list. No extra text or explanation.
`;

    // ✅ Call Gemini
    const result = await model.generateContent(prompt);
    const response = result.response;

    if (!response) {
      throw new Error("Failed to get response from Gemini");
    }

    const questions = response.text().split("\n").filter((q) => q.trim() !== "");
    if (questions.length === 0) {
      throw new Error("Failed to generate questions");
    }

    console.log("✅ Generated Questions:", questions);

    // ✅ Return cleaned questions
    res.status(200).json({
      questions: questions.map((q) => q.replace(/^\d+\.\s*/, "")), // strip numbering
    });
  } catch (error) {
    console.error("❌ Error analyzing resume:", error.message);
    res.status(500).json({
      error: "Failed to analyze resume",
      details: error.message,
    });
  }
};
