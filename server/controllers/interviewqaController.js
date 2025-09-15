import InterviewQA from "../models/InterviewQA.js";

const analyzeResume = async (req, res) => {
  const { userEmail, questions } = req.body;

  // Validate that userEmail is provided
  if (!userEmail) {
    return res.status(400).json({ success: false, error: "userEmail is required." });
  }

  // Validate that questions are provided and each question has an answer
  if (!questions || questions.length === 0) {
    return res.status(400).json({ success: false, error: "At least one question is required." });
  }

  // Check if each question has an answer
  for (let i = 0; i < questions.length; i++) {
    if (!questions[i].answer) {
      return res.status(400).json({
        success: false,
        error: `Answer is required for question ${i + 1}`,
      });
    }
  }

  try {
    // Create a new InterviewQA document
    const newInterviewQA = await InterviewQA.create({
      userEmail,
      questions,
    });

    return res.status(201).json({
      success: true,
      data: newInterviewQA,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Failed to generate interview questions.",
    });
  }
};

export { analyzeResume };
