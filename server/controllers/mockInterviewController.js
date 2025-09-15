const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateInterviewQuestions = async (jobDescription, roleLevel, resumeFile) => {
    try {
        console.log("🔹 Received Inputs:");
        console.log("👉 Job Description:", jobDescription);
        console.log("👉 Role Level:", roleLevel);
        console.log("👉 Resume File:", resumeFile ? "Uploaded" : "Not Provided");

        let prompt = "Generate interview questions based on:\n";
        
        // Add job description to the prompt if available
        if (jobDescription) {
            prompt += `Job Description:\n${jobDescription}\n`;
        }

        // Add role level to the prompt if available
        if (roleLevel) {
            prompt += `Role Level: ${roleLevel}\n`;
        }

        // Handle resume text if file is uploaded
        if (resumeFile) {
            const resumeText = resumeFile.buffer.toString("utf-8");
            prompt += `Resume Content:\n${resumeText.substring(0, 500)}...\n`; // Limit content for brevity
        }

        console.log("🔹 Generated Prompt:\n", prompt);

        // Initialize the Gemini model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
        console.log("✅ Gemini Model Initialized.");

        // Generate the interview questions using the model
        const result = await model.generateContent(prompt);
        console.log("✅ Gemini API Response:", result);

        if (!result || !result.response || !result.response.text) {
            console.error("❌ Invalid response from Gemini API.");
            throw new Error("Gemini API returned an invalid response.");
        }

        // Split the generated text into individual questions
        const questions = result.response.text.split("\n").filter(q => q.trim() !== "");
        console.log("✅ Generated Questions:", questions);

        return questions;
    } catch (error) {
        console.error("❌ Gemini AI Error:", error.message);
        throw new Error("Failed to generate interview questions.");
    }
};

module.exports = { generateInterviewQuestions };
