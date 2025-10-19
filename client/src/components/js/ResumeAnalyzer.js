import React, { useState } from "react";
import axios from "axios";

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file!");
    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      const response = await axios.post("/api/resume-analyze", formData);
      setResult(response.data.feedback);
    } catch (err) {
      console.error(err);
      setResult("Error analyzing resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-interface">
      <h3>AI Resume Analyzer</h3>
      <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>
      {result && (
        <div className="result">
          <h4>Feedback:</h4>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
