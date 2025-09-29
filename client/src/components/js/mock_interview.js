import React, { useState } from "react";
import AnswerRecorder from "../components/AnswerRecorder";

const MockInterviewPage = () => {
  const [questions, setQuestions] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});

  // Fetch AI questions
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

      if (res.ok && data.questions?.length) {
        setQuestions(data.questions);
      } else {
        setQuestions([
          "Tell me about yourself.",
          "What are your strengths and weaknesses?",
          "Why should we hire you?",
        ]);
      }
    } catch (err) {
      console.error(err);
      setError("Server error while fetching questions. Using defaults...");
      setQuestions([
        "Describe a challenging project you worked on.",
        "How do you handle deadlines?",
        "Where do you see yourself in 5 years?",
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Track answers from each AnswerRecorder
  const handleAnswerChange = ({ questionId, text, mediaBlob, mode }) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { text, mediaBlob, mode },
    }));
  };

  // Submit all answers
  const submitAllAnswers = async () => {
    try {
      const formData = new FormData();

      Object.entries(answers).forEach(([qid, ans]) => {
        formData.append(`${qid}_mode`, ans.mode || "text");
        formData.append(`${qid}_text`, ans.text || "");
        if (ans.mediaBlob) {
          const fileName = `${qid}.${ans.mode === "voice" ? "webm" : "mp4"}`;
          formData.append(`${qid}_file`, ans.mediaBlob, fileName);
        }
      });

      const res = await fetch("/api/mock-interview/submit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Answers submitted successfully!");
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
          <div
            key={idx}
            className="mb-6 p-4 border rounded shadow bg-gray-50"
          >
            <h3 className="text-lg font-bold mb-2">
              Question {idx + 1} of {questions.length}
            </h3>
            <p className="mb-4">{q}</p>

            <AnswerRecorder
              questionId={`q${idx}`}
              questionText={q}
              defaultMode="text"
              onAnswerChange={handleAnswerChange}
            />
          </div>
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
