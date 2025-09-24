import React, { useState } from "react";
import AnswerRecorder from "../components/js/AnswerRecorder";

const MockInterviewPage = () => {
  const [questions, setQuestions] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});

  // Fetch questions from backend
  const fetchQuestions = async () => {
    if (!jobDescription.trim()) {
      setError("Please enter a job description to generate questions.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/mock-interview/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      });
      const data = await res.json();

      if (res.ok) {
        setQuestions(data.questions || []);
      } else {
        setError(data.error || "Failed to fetch questions");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while fetching questions");
    } finally {
      setLoading(false);
    }
  };

  // Track answers from each AnswerRecorder
  const handleAnswerChange = ({ questionId, text, mediaUrl, mode }) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { text, mediaUrl, mode },
    }));
  };

  // Submit all answers
  const submitAllAnswers = async () => {
    console.log("Submitting answers:", answers);

    try {
      const res = await fetch("/api/mock-interview/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();

      if (res.ok) {
        alert("Answers submitted successfully!");
      } else {
        alert(data.error || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      alert("Submission failed due to server error");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Mock Interview</h1>

      {/* Job description input */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Enter job description..."
          className="flex-1 border px-4 py-2 rounded"
        />
        <button
          onClick={fetchQuestions}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Generate Questions
        </button>
      </div>

      {loading && <p className="text-gray-700 mb-4">Loading questions...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Test recording */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-center">
          🎤 Test Your Recording (Audio/Video)
        </h2>
        <AnswerRecorder
          questionId="test"
          questionText="Try recording your answer here!"
          onAnswerChange={handleAnswerChange}
        />
      </div>

      {/* AI-generated questions */}
      {questions.length > 0 &&
        questions.map((q, idx) => (
          <AnswerRecorder
            key={idx}
            questionId={`q${idx}`}
            questionText={q}
            defaultMode="voice"
            onAnswerChange={handleAnswerChange}
          />
        ))}

      {/* Submit all answers */}
      {questions.length > 0 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={submitAllAnswers}
            className="bg-green-500 text-white px-6 py-2 rounded"
          >
            Submit All Answers
          </button>
        </div>
      )}
    </div>
  );
};

export default MockInterviewPage;
