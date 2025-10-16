import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const API_KEY = process.env.HUGGINGFACE_API_KEY;

// Free model that works with your key
const MODEL = "sshleifer/tiny-gpt2";

async function query(prompt) {
  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${MODEL}`,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response:", response.data);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
}

// ✅ Example prompt for question generation
const prompt = `
Generate 5 technical interview questions for a React.js developer role.
Focus on JSX, components, hooks, and state management.
`;

query(prompt);
