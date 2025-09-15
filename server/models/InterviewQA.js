import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: String,
  type: String,
  answer: {
    type: String,
    default: "",
  },
});

const interviewQASchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    questions: [questionSchema],
  },
  {
    timestamps: true,
  }
);

const InterviewQA = mongoose.model("InterviewQA", interviewQASchema);

export default InterviewQA;
