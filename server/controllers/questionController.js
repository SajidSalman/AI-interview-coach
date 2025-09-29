import axios from "axios";

// -------------------- GENERATE INTERVIEW QUESTIONS --------------------
export const generateInterviewQuestions = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // ✅ Fallback if no API key
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "dummy_key") {
      return res.status(200).json({
        questions: [
          "What technologies have you recently worked with?",
          "Can you explain a project you are most proud of?",
          "How do you approach debugging?",
          "Describe a time you worked in a team.",
          "What motivates you to apply for this role?",
        ],
      });
    }

    // ✅ Dynamically import pdf-parse only when needed
    const { default: pdfParse } = await import("pdf-parse");

    // Extract text from PDF
    const dataBuffer = req.file.buffer;
    const pdfData = await pdfParse(dataBuffer);
    const extractedText = pdfData.text;

    if (!extractedText || extractedText.trim() === "") {
      throw new Error("Failed to extract text from PDF. Try another format.");
    }

    // ✅ Call Gemini REST API properly
    const apiResponse = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: `Based on the following resume, generate 5-7 interview questions:\n\n${extractedText}`,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
      }
    );

    if (
      !apiResponse.data ||
      !apiResponse.data.candidates ||
      apiResponse.data.candidates.length === 0
    ) {
      throw new Error("AI response is empty. Check API request.");
    }

    // ✅ Extract AI response text
    const aiResponse =
      apiResponse.data.candidates[0]?.content?.parts
        ?.map((part) => part.text)
        .join("\n") || "";

    res.json({ questions: aiResponse.split("\n").filter((q) => q.trim()) });
  } catch (error) {
    console.error("❌ Error in Question Generation:", error.message);
    res.status(500).json({ error: error.message });
  }
};
