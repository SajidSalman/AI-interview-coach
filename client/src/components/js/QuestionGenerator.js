import React, { useState } from "react";
import axios from "axios";

const QuestionGenerator = () => {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return alert("Enter a topic or job role!");
    try {
      setLoading(true);
      const response = await axios.post("/api/generate-questions", { topic });
      setQuestions(response.data.questions);
    } catch (err) {
      console.error(err);
      setQuestions(["Error generating questions."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-interface">
      <h3>AI Question Generator</h3>
      <input
        type="text"
        placeholder="Enter topic or role"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Questions"}
      </button>
      {questions.length > 0 && (
        <div className="result">
          <h4>Questions:</h4>
          <ul>
            {questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuestionGenerator;
