const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    // Attempt to fetch the models directly (this is a workaround since listModels is not exposed)
    const models = [
      "gemini-1.0-pro", 
      "gemini-1.0-pro-latest", 
      "gemini-1.5-pro", 
      "gemini-1.5-pro-latest", 
      "gemini-1.5-flash",
      "gemini-1.5-flash-latest"
    ];

    console.log("Available Models:");
    models.forEach((model) => {
      try {
        genAI.getGenerativeModel({ model });
        console.log(`✅ ${model} - Available`);
      } catch (error) {
        console.log(`❌ ${model} - Not Available`);
      }
    });
  } catch (error) {
    console.error("Error listing models:", error.message);
  }
}

listModels();
