import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

// This file no longer handles any AI logic.
// It only handles the uploading of media (audio/video) files.

const router = express.Router();

// ---------------------------
// Multer for audio/video answers (disk storage)
// ---------------------------
const answersDir = path.join(process.cwd(), "uploads", "answers");
if (!fs.existsSync(answersDir)) fs.mkdirSync(answersDir, { recursive: true });

const storageDisk = multer.diskStorage({
  destination: (req, file, cb) => cb(null, answersDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const uploadDisk = multer({
  storage: storageDisk,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("audio/") || file.mimetype.startsWith("video/")) cb(null, true);
    else cb(new Error("Only audio and video files are allowed!"));
  },
});

// ---------------------------
// Submit answers route
// ---------------------------
router.post("/submit-answer", uploadDisk.array("mediaFiles"), async (req, res) => {
  try {
    const files = req.files || [];
    let textAnswers = [];

    if (req.body.textAnswers) {
      textAnswers = Array.isArray(req.body.textAnswers)
        ? req.body.textAnswers.map((t) => JSON.parse(t))
        : [JSON.parse(req.body.textAnswers)];
    }

    const metadata = { textAnswers, files, submittedAt: new Date() };
    console.log("💾 Answers submitted:", metadata);

    res.json({ success: true, metadata });
  } catch (err)
 {
    console.error("❌ /submit-answer Error:", err);
    res.status(500).json({ error: "Failed to save answers." });
  }
});

export default router;