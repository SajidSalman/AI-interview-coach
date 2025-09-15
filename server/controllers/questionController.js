import axios from "axios";

// -------------------- GENERATE INTERVIEW QUESTIONS --------------------
export const generateInterviewQuestions = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // ✅ Dynamically import pdf-parse
    const { default: pdfParse } = await import("pdf-parse");

    // Extract text from PDF
    const dataBuffer = req.file.buffer;
    const pdfData = await pdfParse(dataBuffer);
    const extractedText = pdfData.text;

    if (!extractedText || !extractedText.trim()) {
      throw new Error("Failed to extract text from PDF. Try another format.");
    }

    console.log("📄 Extracted Resume Text:", extractedText);

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

    console.log("🔎 Full Gemini API response:", JSON.stringify(apiResponse.data, null, 2));

    if (
      !apiResponse.data ||
      !apiResponse.data.candidates ||
      apiResponse.data.candidates.length === 0
    ) {
      throw new Error("AI response is empty. Check API request.");
    }

    // ✅ Extract and clean AI response
    const aiResponse =
      apiResponse.data.candidates[0]?.content?.parts
        ?.map((part) => part.text)
        .join("\n") || "";

    const questions = aiResponse
      .split("\n")
      .map((q) => q.replace(/^\d+[\.\)]\s*/, "").trim()) // remove numbering
      .filter((q) => q !== "");

    console.log("✅ Generated Questions:", questions);

    res.json({ questions });
  } catch (error) {
    console.error("❌ Error in Question Generation:", error.message);
    res.status(500).json({
      error: "Failed to generate interview questions",
      details: error.message,
    });
  }
};
