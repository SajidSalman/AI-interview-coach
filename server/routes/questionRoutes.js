// File: routes/questionRoutes.js
import express from "express";
import multer from "multer";
import { generateInterviewQuestions } from "../controllers/questionController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store file in memory

// ✅ Route for generating interview questions
router.post("/generate-questions", upload.single("resume"), generateInterviewQuestions);

export default router;
