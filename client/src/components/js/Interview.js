import React, { useState } from 'react';
import './styles/Interview.css';

const Interview = () => {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Handle File Upload
  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
    setError('');
  };

  // ✅ Handle Job Description Input
  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value);
    setError('');
  };

  // ✅ Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setQuestions([]);

    try {
      const formData = new FormData();
      if (resume) {
        formData.append('resume', resume);
      }
      if (jobDescription) {
        formData.append('jobDescription', jobDescription);
      }

      console.log("➡️ Sending data to backend...");

      const response = await fetch("http://localhost:5000/api/resume/analyze", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to analyze resume: ${response.statusText}`);
      }

      const data = await response.json();

      console.log("✅ Response from backend:", data);

      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        setError('No questions generated. Please try again.');
      }
    } catch (error) {
      console.error("❌ Error:", error.message);
      setError(error.message || 'Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="interview-container">
      <h2>AI-Powered Mock Interview Generator</h2>
      
      {/* ✅ Upload Form */}
      <form onSubmit={handleSubmit} className="interview-form">
        <textarea
          placeholder="Enter job description..."
          value={jobDescription}
          onChange={handleJobDescriptionChange}
          rows="5"
        />
        
        <input
          type="file"
          accept=".pdf, .docx, .txt"
          onChange={handleFileChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Generating Questions...' : 'Generate Questions'}
        </button>
      </form>

      {/* ✅ Loading State */}
      {loading && <p className="loading">⏳ Generating questions...</p>}

      {/* ✅ Error Handling */}
      {error && <p className="error">{error}</p>}

      {/* ✅ Display Generated Questions */}
      {questions.length > 0 && (
        <div className="questions-list">
          <h3>Generated Questions:</h3>
          <ul>
            {questions.map((q, index) => (
              <li key={index}>
                {index + 1}. {q}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Interview;
