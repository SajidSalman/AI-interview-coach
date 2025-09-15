import React from "react";
import "../css/ai_tools.css";
import aiResume from "../images/resume.png";
import aiDebugger from "../images/debugger.png";
import aiQuestion from "../images/question.png";
import aiSpeech from "../images/speech.png";

const AITools = () => {
  return (
    <section className="ai-tools-section">
      <h2 className="section-title">AI-Powered Tools</h2>
      <p className="section-subtitle">Enhance your interview preparation with smart AI tools.</p>

      <div className="tools-container">
        <div className="tool-card">
          <img src={aiResume} alt="AI Resume Analyzer" className="tool-icon" />
          <h3 className="tool-title">AI Resume Analyzer</h3>
          <p className="tool-description">
            Get instant feedback on your resume to improve your chances of getting hired.
          </p>
        </div>

        <div className="tool-card">
          <img src={aiDebugger} alt="Code Debugger" className="tool-icon" />
          <h3 className="tool-title">Code Debugger</h3>
          <p className="tool-description">
            Analyze and debug your code automatically with AI-driven insights.
          </p>
        </div>

        <div className="tool-card">
          <img src={aiQuestion} alt="AI Question Generator" className="tool-icon" />
          <h3 className="tool-title">AI Question Generator</h3>
          <p className="tool-description">
            Generate industry-specific interview questions to test your knowledge.
          </p>
        </div>

        <div className="tool-card">
          <img src={aiSpeech} alt="Speech Analyzer" className="tool-icon" />
          <h3 className="tool-title">Speech Analyzer</h3>
          <p className="tool-description">
            Improve your speaking skills with AI-powered speech analysis and feedback.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AITools;
