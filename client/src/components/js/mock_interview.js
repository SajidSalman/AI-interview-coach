import React, { useState } from "react";
import AnswerRecorder from "./AnswerRecorder";
import axios from "axios";
import "../css/mockInterview.css";

const MockInterviewPage = () => {
  const [questions, setQuestions] = useState([]);
  const [visibleQuestions, setVisibleQuestions] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [email, setEmail] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [feedbacks, setFeedbacks] = useState({});

  const defaultQuestions = [
    { question: "Tell me about yourself.", tip: "Highlight your strengths." },
    { question: "What are your strengths and weaknesses?", tip: "Be honest but positive." },
    { question: "Why should we hire you?", tip: "Show enthusiasm and alignment." },
    { question: "Describe a challenging project you worked on.", tip: "Focus on problem-solving." },
    { question: "Where do you see yourself in 5 years?", tip: "Show ambition and growth." },
  ];

  const handleFileChange = (e) => setResumeFile(e.target.files[0]);

  // -------------------------------
  // Generate questions via Gemini AI
  // -------------------------------
  const fetchQuestions = async () => {
    if (!jobDescription.trim() || !email.trim() || !resumeFile) {
      return alert("Please enter Job Description, Registered Email, and upload your Resume.");
    }

    setLoading(true);
    setError("");
    setQuestions([]);
    setVisibleQuestions([]);
    setFeedbacks({});
    setAnswers({});

    try {
      const formData = new FormData();
      formData.append("jobDescription", jobDescription);
      formData.append("email", email);
      formData.append("resume", resumeFile);

      const res = await axios.post(
        "http://localhost:5000/api/mock-interview/analyze",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const aiQuestions = res.data.questions || defaultQuestions;
      setQuestions(aiQuestions);

      aiQuestions.forEach((q, idx) => {
        setTimeout(() => setVisibleQuestions(prev => [...prev, q]), idx * 500);
      });

      if (!aiQuestions.length) setError("No AI-generated questions found. Using default questions.");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch AI questions. Using fallback questions.");
      setQuestions(defaultQuestions);
      defaultQuestions.forEach((q, idx) =>
        setTimeout(() => setVisibleQuestions(prev => [...prev, q]), idx * 500)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = ({ questionId, text, mediaBlob, mode }) => {
    setAnswers(prev => ({ ...prev, [questionId]: { text, mediaBlob, mode } }));
  };

  // -------------------------------
  // Submit answers and get Gemini feedback
  // -------------------------------
  const submitAllAnswers = async () => {
    if (!questions.length) return alert("Please generate questions first.");

    const answeredQuestions = Object.values(answers).filter(a => a.text?.trim() || a.mediaBlob);
    if (!answeredQuestions.length) return alert("Please answer at least one question before submitting.");

    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(answers).forEach(([qid, ans]) => {
        formData.append(
          "textAnswers",
          JSON.stringify({ questionId: qid, text: ans.text || "", mode: ans.mode || "text" })
        );
        if (ans.mediaBlob) {
          const ext = ans.mode === "voice" ? "webm" : "mp4";
          formData.append("mediaFiles", ans.mediaBlob, `${qid}.${ext}`);
        }
      });

      const res = await axios.post(
        "http://localhost:5000/api/mock-interview/submit-answer",
        formData
      );

      if (!res.data.success) throw new Error(res.data.error || "Submission failed");

      const textAnswersArray = Object.entries(answers).map(([qid, ans]) => ({
        questionId: qid,
        text: ans.text || "",
      }));

      // Fetch feedback via Gemini AI
      const feedbackRes = await axios.post(
        "http://localhost:5000/api/mock-interview/review-answers",
        { textAnswers: textAnswersArray }
      );

      const feedbackObj = {};
      feedbackRes.data.feedback.forEach(f => (feedbackObj[f.questionId] = f.feedback));

      setFeedbacks(feedbackObj);
      setAnswers({});
      alert("✅ Answers submitted successfully! Feedback is displayed below each question.");
    } catch (err) {
      console.error(err);
      alert(err.message || "Submission failed due to server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mock-interview-page">
      <div className="start-interview-box">
        <h1 className="questions-title">Mock Interview</h1>

        {/* Input Form */}
        <div className="start-interview-form-section">
          <div className="form-field">
            <label className="start-input-label">
              Job Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Enter job description for the role..."
              className="start-input-box"
            />
          </div>

          <div className="form-field">
            <label className="start-input-label">
              Registered Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your registered email..."
              className="start-input-box"
            />
          </div>

          <div className="form-field">
            <label className="start-input-label">
              Resume Upload <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="start-input-box"
            />
            <p className="text-gray-500 text-sm mt-1">Upload your resume in PDF format</p>
          </div>

          <div className="button-container">
            <button
              onClick={fetchQuestions}
              disabled={loading}
              className="start-interview-button"
            >
              {loading ? "Generating..." : "Generate Questions"}
            </button>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        {/* Questions */}
        <div className="questions-container">
          {visibleQuestions.map((q, idx) => {
            const qid = `q${idx}`;
            return (
              <div key={qid} className="question-card fade-in-up">
                <h3 className="question-title">
                  Question {idx + 1} of {questions.length}
                </h3>

                <AnswerRecorder
                  questionId={qid}
                  questionText={q.question}
                  defaultMode="text"
                  onAnswerChange={handleAnswerChange}
                />

                {feedbacks[qid] && (
                  <div className="feedback-box">
                    <strong>Feedback:</strong> {feedbacks[qid]}
                  </div>
                )}
              </div>
            );
          })}

          {questions.length > 0 && (
            <div className="button-container">
              <button
                onClick={submitAllAnswers}
                disabled={loading}
                className="start-interview-button submit-btn"
              >
                {loading ? "Submitting..." : "Submit All Answers & Get Feedback"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MockInterviewPage;
