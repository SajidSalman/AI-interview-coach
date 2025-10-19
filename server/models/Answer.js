import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  userId: { type: String },
  mode: { type: String, enum: ["text", "voice", "video"], default: "text" },
  text: { type: String },
  filePath: { type: String },
  fileType: { type: String },
  uploadedAt: { type: Date, default: Date.now }
});

const Answer = mongoose.model("Answer", answerSchema);
export default Answer;
