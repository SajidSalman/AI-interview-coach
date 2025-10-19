import React, { useState } from "react";

const SpeechAnalyzer = () => {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleAnalyze = () => {
    if (!text) return alert("Enter text to analyze!");
    // Here you can replace with AI API call
    setFeedback("Sample feedback: Clear pronunciation and good pace.");
  };

  return (
    <div className="tool-interface">
      <h3>Speech Analyzer</h3>
      <textarea
        placeholder="Type or paste your speech text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleAnalyze}>Analyze Speech</button>
      {feedback && (
        <div className="result">
          <h4>Feedback:</h4>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default SpeechAnalyzer;
