import React, { useState, useEffect } from "react"; // Import useEffect
import AnswerRecorder from "./AnswerRecorder";
import axios from "axios";
import "../css/mockInterview.css";

const MockInterviewPage = () => {
  const [questions, setQuestions] = useState([]);
  const [visibleQuestions, setVisibleQuestions] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  // const [email, setEmail] = useState(""); // REMOVED email state
  const [loggedInUserEmail, setLoggedInUserEmail] = useState(""); // ADDED state for logged-in user's email
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [feedbacks, setFeedbacks] = useState({});

  // --- ADDED: Get logged-in user's email on component mount ---
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email) {
      setLoggedInUserEmail(user.email);
    } else {
      // Handle case where user is not logged in or email is missing
      setError("User not logged in or email not found. Please log in again.");
      console.error("User data not found in localStorage");
      // Optional: Redirect to login page
      // navigate('/login');
    }
  }, []); // Empty dependency array ensures this runs only once on mount
  // --- END ADDED SECTION ---


  // --- Fallback Question/Feedback Pools (Keep as before) ---
  const fallbackQuestionsPool = [
    // ... (keep your list of fallback questions)
    { question: "Tell me about yourself.", answer: "Focus on your relevant experience and skills." },
    { question: "What are your strengths?", answer: "Provide specific examples related to the job." },
    { question: "What are your weaknesses?", answer: "Be honest but show self-awareness and how you're improving." },
    { question: "Why should we hire you?", answer: "Highlight your unique qualifications and enthusiasm." },
    { question: "Why do you want to work here?", answer: "Show you've researched the company and align with its values." },
    { question: "Describe a challenging project you worked on.", answer: "Use the STAR method (Situation, Task, Action, Result)." },
    { question: "How do you handle stress or pressure?", answer: "Describe your coping mechanisms and focus on positive outcomes." },
    { question: "Where do you see yourself in 5 years?", answer: "Show ambition and how it aligns with the company's growth." },
    { question: "Tell me about a time you failed.", answer: "Focus on what you learned and how you grew from the experience." },
    { question: "How do you work in a team?", answer: "Give examples of collaboration and communication." },
    { question: "What are your salary expectations?", answer: "Research the role and provide a realistic range." },
    { question: "Do you have any questions for us?", answer: "Always prepare thoughtful questions about the role or company." },
  ];
  const feedbackPool = [
    // ... (keep your list of feedback suggestions)
    "Good start, but could be more specific.",
    "Clear and concise answer.",
    "Try using the STAR method to structure your response.",
    "A bit vague, add more detail about your specific actions.",
    "Excellent example, clearly demonstrated the skill.",
    "Focus more on the positive outcome or what you learned.",
    "Enthusiasm is good, but ensure the answer is professional.",
    "Relate this back to the requirements in the job description.",
    "Make sure to quantify your achievements if possible.",
    "Well-structured answer, easy to follow.",
  ];
  const getRandomItems = (arr, num) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  };
  // --- End Fallback Pools ---

  const handleFileChange = (e) => setResumeFile(e.target.files[0]);

  const fetchQuestions = async () => {
    // --- UPDATED: Check for loggedInUserEmail instead of typed email ---
    if (!jobDescription.trim() || !loggedInUserEmail || !resumeFile) {
      return alert("Please enter Job Description, upload your Resume, and ensure you are logged in.");
    }
    // --- END UPDATE ---

    setLoading(true);
    setError("");
    setQuestions([]);
    setVisibleQuestions([]);
    setFeedbacks({});
    setAnswers({});

    try {
      const formData = new FormData();
      formData.append("jobDescription", jobDescription);
      // --- UPDATED: Send loggedInUserEmail instead of typed email ---
      formData.append("userEmail", loggedInUserEmail);
      // --- END UPDATE ---
      formData.append("resume", resumeFile);

      // --- ADDED: Include the auth token in the request header ---
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }
      // --- END ADDED SECTION ---

      const res = await axios.post(
        "http://localhost:5000/api/gemini/generate",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}` // Send the token
          }
        }
      );

      const aiQuestions = res.data.qaPairs;

      if (aiQuestions && aiQuestions.length > 0) {
         setQuestions(aiQuestions);
         aiQuestions.forEach((q, idx) => {
           setTimeout(() => setVisibleQuestions(prev => [...prev, q]), idx * 500);
         });
      } else {
         setError("AI questions unavailable. Using random fallback questions.");
         console.log("AI failed, generating 5 random fallback questions.");
         const randomQuestions = getRandomItems(fallbackQuestionsPool, 5);
         setQuestions(randomQuestions);
         randomQuestions.forEach((q, idx) => {
           setTimeout(() => setVisibleQuestions(prev => [...prev, q]), idx * 500);
         });
      }

    } catch (err) {
      console.error("Error fetching AI questions:", err);
      // Check if it's an authentication error from the backend
      if (err.response && err.response.status === 401) {
          setError("Authentication failed. Please log in again.");
          // Optional: redirect to login
          // navigate('/login');
      } else {
          setError("Failed to fetch AI questions. Using random fallback questions.");
          console.log("Fetch failed, generating 5 random fallback questions.");
          const randomQuestions = getRandomItems(fallbackQuestionsPool, 5);
          setQuestions(randomQuestions);
          randomQuestions.forEach((q, idx) =>
            setTimeout(() => setVisibleQuestions(prev => [...prev, q]), idx * 500)
          );
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Manual feedback function (Keep as before) ---
  const handleAnswerChange = ({ questionId, text, mediaBlob, mode }) => {
    setAnswers(prev => ({ ...prev, [questionId]: { text, mediaBlob, mode } }));
  };

  const submitAllAnswers = async () => {
    // ... (Keep the manual feedback logic exactly as it was)
    if (!questions.length) return alert("Please generate questions first.");

    const answeredQuestions = Object.values(answers).filter(a => a.text?.trim() || a.mediaBlob);
    if (!answeredQuestions.length) return alert("Please answer at least one question before submitting.");

    setLoading(true);
    setError("");

    try {
      console.log("Starting manual feedback input...");
      const manualFeedbacks = {};

      for (let i = 0; i < visibleQuestions.length; i++) {
        const question = visibleQuestions[i];
        const questionId = `q${i}`;
        const userAnswer = answers[questionId];

        if (userAnswer && (userAnswer.text?.trim() || userAnswer.mediaBlob)) {
          const randomSuggestion = getRandomItems(feedbackPool, 1)[0] || "Enter feedback here...";

          console.log(`Asking for feedback for question ${i + 1}: ${question.question}`);
          const feedbackText = prompt(
            `Question ${i + 1}: ${question.question}\n\nUser Answer: ${userAnswer.text || "(Media Answer)"}\n\nEnter your feedback:`,
            randomSuggestion
          );

          if (feedbackText !== null) {
            manualFeedbacks[questionId] = feedbackText.trim() || "No feedback provided.";
            console.log(`Feedback received for ${questionId}: ${manualFeedbacks[questionId]}`);
          } else {
            console.log(`Feedback skipped for ${questionId}`);
          }
        } else {
           console.log(`No answer provided for ${questionId}, skipping feedback.`);
        }
      }

      setFeedbacks(manualFeedbacks);
      setAnswers({});
      alert("✅ Manual feedback entered! Feedback is displayed below each question.");

    } catch (err) {
      console.error("Error during manual feedback process:", err);
      setError("An error occurred while processing feedback.");
      alert("An error occurred while processing feedback.");
    } finally {
      setLoading(false);
      console.log("Manual feedback process finished.");
    }
  };
  // --- End Manual Feedback ---

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

          {/* --- REMOVED Email Input Field ---
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
          */}

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
            {/* Disable button if not logged in */}
            <button
              onClick={fetchQuestions}
              disabled={loading || !loggedInUserEmail}
              className="start-interview-button"
              title={!loggedInUserEmail ? "Please log in to generate questions" : ""}
            >
              {loading ? "Generating..." : "Generate Questions"}
            </button>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        {/* Display Logged In User Email (Optional) */}
        {loggedInUserEmail && <p style={{ textAlign: 'center', marginTop: '10px', color: '#555' }}>Generating for: {loggedInUserEmail}</p>}


        {/* Questions */}
        <div className="questions-container">
          {/* ... (Keep the rest of the JSX as before) ... */}
          {visibleQuestions.map((q, idx) => {
            const qid = `q${idx}`;
            return (
              <div key={qid} className="question-card fade-in-up">
                <h3 className="question-title">
                  Question {idx + 1} of {visibleQuestions.length}
                </h3>

                <AnswerRecorder
                  questionId={qid}
                  questionText={q.question}
                  defaultMode="text"
                  onAnswerChange={handleAnswerChange}
                />

                {q.answer && (
                  <div className="model-answer-box">
                    <strong>Model Answer:</strong> {q.answer}
                  </div>
                )}

                {feedbacks[qid] && (
                  <div className="feedback-box">
                    <strong>Feedback:</strong> {feedbacks[qid]}
                  </div>
                )}
              </div>
            );
          })}

          {visibleQuestions.length > 0 && (
            <div className="button-container">
              <button
                onClick={submitAllAnswers}
                disabled={loading || Object.keys(answers).length === 0}
                className="start-interview-button submit-btn"
              >
                {loading ? "Processing..." : "Submit Answers & Get Manual Feedback"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MockInterviewPage;