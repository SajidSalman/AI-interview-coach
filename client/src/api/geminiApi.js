export const fetchGeminiResponse = async (prompt) => {
  try {
    const response = await fetch("http://localhost:5000/api/gemini/generate-response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "Error fetching response.";
  }
};
