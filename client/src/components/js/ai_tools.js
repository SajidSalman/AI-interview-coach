import React, { useState } from "react";
import "../css/ai_tools.css";

import ResumeAnalyzer from "./ResumeAnalyzer";
import CodeDebugger from "./CodeDebugger";
import QuestionGenerator from "./QuestionGenerator";
import SpeechAnalyzer from "./SpeechAnalyzer";

import aiResume from "../images/resume.png";
import aiDebugger from "../images/debugger.png";
import aiQuestion from "../images/question.png";
import aiSpeech from "../images/speech.png";

const toolsData = [
  {
    id: "resume",
    title: "AI Resume Analyzer",
    img: aiResume,
    description:
      "Get instant feedback on your resume to improve your chances of getting hired.",
    component: <ResumeAnalyzer />,
  },
  {
    id: "debugger",
    title: "Code Debugger",
    img: aiDebugger,
    description:
      "Analyze and debug your code automatically with AI-driven insights.",
    component: <CodeDebugger />,
  },
  {
    id: "question",
    title: "AI Question Generator",
    img: aiQuestion,
    description:
      "Generate industry-specific interview questions to test your knowledge.",
    component: <QuestionGenerator />,
  },
  {
    id: "speech",
    title: "Speech Analyzer",
    img: aiSpeech,
    description:
      "Improve your speaking skills with AI-powered speech analysis and feedback.",
    component: <SpeechAnalyzer />,
  },
];

const AITools = () => {
  const [selectedTool, setSelectedTool] = useState(null);

  return (
    <section className="ai-tools-section">
      <h2 className="section-title">AI-Powered Tools</h2>
      <p className="section-subtitle">
        Enhance your interview preparation with smart AI tools.
      </p>

      {/* Tool Cards with descriptions */}
      <div className="tools-container">
        {toolsData.map((tool) => (
          <div key={tool.id} className="tool-card" onClick={() => setSelectedTool(tool.id)}>
            <img src={tool.img} alt={tool.title} className="tool-icon" />
            <h3 className="tool-title">{tool.title}</h3>
            <p className="tool-description">{tool.description}</p>
          </div>
        ))}
      </div>

      {/* Interactive Tool Interface shown separately */}
      {selectedTool && (
        <div className="tool-interface">
          {toolsData.find((tool) => tool.id === selectedTool)?.component}
        </div>
      )}
    </section>
  );
};

export default AITools;
