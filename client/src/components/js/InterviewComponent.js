import React, { useState } from 'react';
import axios from 'axios';

const InterviewComponent = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [questions, setQuestions] = useState([]);

  const handleGenerateQuestions = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/gemini/generate-questions', { jobDescription });
      
      // ✅ Log the response for debugging
      console.log('🔹 API Response:', response.data);

      // ✅ Fix the handling of questions
      if (Array.isArray(response.data.questions)) {
        setQuestions(response.data.questions); // ✅ Set directly since it's already an array
      } else if (typeof response.data.questions === 'string') {
        setQuestions(response.data.questions.split('\n')); // ✅ Handle string responses
      } else {
        console.error('⚠️ Unexpected response format:', response.data);
        setQuestions([]);
      }
    } catch (error) {
      console.error('❌ Error generating questions:', error);
    }
  };

  return (
    <div>
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Enter job description..."
      />
      <button onClick={handleGenerateQuestions}>Generate Questions</button>

      <div>
        <h3>Generated Questions:</h3>
        <ul>
          {questions.map((q, index) => (
            <li key={index}>{q}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InterviewComponent;
