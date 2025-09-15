import dotenv from "dotenv";
dotenv.config();

import path from "path";
import { fileURLToPath } from "url";
console.log("🧪 MONGO_URI is:", process.env.MONGO_URI);

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import fs from "fs";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import geminiRoutes from "./routes/geminiRoutes.js";
import mockInterviewRoutes from "./routes/mockInterviewRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // Ensure this is correct

const app = express();

// Connect to MongoDB
connectDB()
  .then(() => console.log("✅ MongoDB Connected..."))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`✅ Created 'uploads' directory at ${uploadDir}`);
} else {
  console.log(`✅ 'uploads' directory exists at ${uploadDir}`);
}

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes); // Authentication routes (register, login, forgot password, reset password)
app.use("/api/gemini", geminiRoutes); 
app.use("/api/mock-interview", mockInterviewRoutes);
app.use("/api/resume", resumeRoutes);

// Test Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "🚀 Server running!" });
});

// 404 Handler
app.use((req, res) => {
   res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.stack);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("\n🔴 Shutting down server...");
  server.close(async () => {
     await mongoose.connection.close();
    console.log("✅ Database closed. Exiting...");
    process.exit(0);
  });
});
