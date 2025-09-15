import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
 import "../css/startInterview.css";

const MockInterview = () => {
  const [email, setEmail] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [roleLevel, setRoleLevel] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handleResumeUpload = (e) => {
    setResume(e.target.files[0]);
  };

   const generateQuestions = async () => {
    setLoading(true);
    setError(null);
    setQuestions([]);
    setAnswers([]);
    setCurrentQuestionIndex(0);

    if (!email) {
      setError("User not logged in. Please login first.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userEmail", email);
      if (jobDescription.trim()) formData.append("jobDescription", jobDescription);
      if (resume) formData.append("resume", resume); // ✅ Must match backend field
      if (roleLevel) formData.append("roleLevel", roleLevel);

      const response = await fetch("http://localhost:5000/api/gemini/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const fetchedQuestions = Array.isArray(data.questions) ? data.questions : [];
        console.log("✅ Fetched Questions:", fetchedQuestions);
        setQuestions(fetchedQuestions);
        setAnswers(new Array(fetchedQuestions.length).fill(""));
      } else {
        setError(data.error || "Failed to generate questions.");
       }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Request failed. Please try again later.");
     } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (e) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = e.target.value;
    setAnswers(updatedAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const submitAnswers = async () => {
    if (!email) {
      alert("User not logged in. Please login first.");
      return;
    }

    if (!questions.length || !answers.length) {
      alert("No questions or answers to submit.");
      return;
    }

    const unfilled = answers.some((ans) => ans.trim() === "");
    if (unfilled) {
      alert("Please answer all questions before submitting.");
      return;
    }

    const qaPayload = questions.map((q, i) => ({
      question: typeof q === "string" ? q : q.question,
      answer: answers[i],
      type: typeof q === "string" ? "general" : q.type || "general",
    }));

    try {
      const response = await fetch("http://localhost:5000/api/mock-interview/submit-qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, questions: qaPayload }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Answers submitted successfully!");
        setQuestions([]);
        setAnswers([]);
        setCurrentQuestionIndex(0);
      } else {
        alert(data.message || "Failed to submit answers.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong while submitting. Check console.");
    }
  };

  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return <p>Invalid question data</p>;

    const questionText =
      typeof currentQuestion === "string"
        ? currentQuestion
        : currentQuestion?.question || "No question available";

    return (
      <>
        <h3 className="questions-title">
          Question {currentQuestionIndex + 1} of {questions.length}
        </h3>

        <p className="question-item">{questionText}</p>

        <textarea
          className="answer-input"
          placeholder="Type your answer here"
          value={answers[currentQuestionIndex] || ""}
          onChange={handleAnswerChange}
        />

        <div className="button-container">
          {currentQuestionIndex < questions.length - 1 ? (
            <button className="next-button" onClick={handleNextQuestion}>
              Next
            </button>
          ) : (
            <button className="submit-button" onClick={submitAnswers}>
              Submit Answers
            </button>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <Navbar />
      <section id="mock-interview">
        <div className="mock-interview-section">
          <div className="mock-container">
            <div className="mock-text">
              <h2>AI-Powered Mock Interviews</h2>
              <p>
                Prepare for real interviews with AI-driven mock sessions. Get instant feedback,
                track your progress, and improve with personalized insights.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <div className="start-interview-container">
  
        <div className="start-interview-box">
          <form className="start-interview-form">
            <div>
              <label className="start-input-label">Email</label>
              <input
                type="email"
                className="start-input-box"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                required
              />
            </div>

            <div>
              <label className="start-input-label">Job Description (Optional)</label>
              <textarea
                className="start-textarea-box"
                placeholder="Paste the job description here"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
 
            <div className="role-level-container">
              <label className="role-level-label">Role Level</label>
              <select
                className="role-level-dropdown"
                value={roleLevel}
                onChange={(e) => setRoleLevel(e.target.value)}
              >
                <option value="">Select your role level</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="lead">Lead</option>
              </select>
            </div>

            <div>
              <label className="start-input-label">Upload Resume (Optional)</label>
              <input
                type="file"
                className="start-input-box"
                onChange={handleResumeUpload}
                name="resume" // ✅ Must match backend field
              />
            </div>

            <div className="button-container">
              <button
                type="button"
                className="start-interview-button"
                onClick={generateQuestions}
                disabled={loading || (!jobDescription && !resume) || !roleLevel}
              >
                {loading ? "Generating..." : "Generate Questions"}
              </button>
            </div>
          </form>

          {error && <p className="error-message">{error}</p>}

          {questions.length > 0 && (
            <div className="question-answer-box">{renderQuestion()}</div>
          )}
        </div>
      </div>
     </>
  );
};

export default MockInterview;
