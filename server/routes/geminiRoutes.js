import express from "express";
import multer from "multer";

// Import both controller functions
import { 
  analyzeResumeOrJD, 
  getFeedback 
} from "../controllers/geminiController.js";

const router = express.Router();

// --- Middleware ---
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- Phase 1 Route ---
router.post("/generate", upload.single("resume"), analyzeResumeOrJD);

// --- Phase 2 Route ---
// This is the route that was missing from your saved file
router.post("/feedback", getFeedback); 

export default router;