import React, { useState } from "react";
import axios from "axios";

const CodeDebugger = () => {
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDebug = async () => {
    if (!code) return alert("Enter your code!");
    try {
      setLoading(true);
      const response = await axios.post("/api/debug-code", { code });
      setFeedback(response.data.feedback);
    } catch (err) {
      console.error(err);
      setFeedback("Error debugging code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-interface">
      <h3>Code Debugger</h3>
      <textarea
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={handleDebug} disabled={loading}>
        {loading ? "Analyzing..." : "Debug Code"}
      </button>
      {feedback && (
        <div className="result">
          <h4>Debug Feedback:</h4>
          <pre>{feedback}</pre>
        </div>
      )}
    </div>
  );
};

export default CodeDebugger;
