import express from "express";
import multer from "multer";
import {
  analyzeResumeOrJD,
  analyzeResume,
  submitQA,
} from "../controllers/geminiController.js";

const router = express.Router();
 const upload = multer({ storage: multer.memoryStorage() });

router.post("/analyze", upload.single("resume"), analyzeResumeOrJD);
router.post("/analyze-resume", upload.single("file"), analyzeResume);
router.post("/submit", submitQA);

export default router;
