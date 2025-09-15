const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // ✅ Updated model
    const prompt = "What are the top skills required for a software developer?";
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    console.log("✅ Gemini Response:", response.text());
  } catch (err) {
    console.error("❌ Gemini API Error:", err.message);
  }
}

testGemini();
