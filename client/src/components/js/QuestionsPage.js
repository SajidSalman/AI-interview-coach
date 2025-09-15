import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const QuestionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Wrap questions in useMemo to avoid unnecessary re-creation
  const questions = useMemo(
    () => location.state?.questions || [],
    [location.state?.questions]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(new Array(questions.length).fill(''));

  useEffect(() => {
    console.log('Questions:', questions);
  }, [questions]); // ✅ Now it won’t trigger unnecessarily

  const handleAnswerChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    console.log('Submitted Answers:', answers);

    try {
      const response = await fetch('/api/submit-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      if (response.ok) {
        alert('Answers submitted successfully!');
        navigate('/mock-interview');
      } else {
        throw new Error('Failed to submit answers');
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('Failed to submit answers. Try again.');
    }
  };

  return (
    <div className="question-page">
      <h2>Question {currentIndex + 1} of {questions.length}</h2>
      <p className="question">{questions[currentIndex]}</p>

      <textarea
        className="answer-box"
        value={answers[currentIndex]}
        onChange={handleAnswerChange}
        placeholder="Write your answer here..."
      />

      <div className="navigation-buttons">
        {currentIndex > 0 && (
          <button onClick={handlePrevious} className="nav-button">
            Previous
          </button>
        )}
        {currentIndex < questions.length - 1 ? (
          <button onClick={handleNext} className="nav-button">
            Next
          </button>
        ) : (
          <button onClick={handleSubmit} className="submit-button">
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionPage;
