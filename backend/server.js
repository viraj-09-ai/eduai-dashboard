require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ✅ ROUTES (MAKE SURE FILE NAMES MATCH EXACTLY)
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/studentRoutes");
const messageRoutes = require("./routes/messageRoutes"); // Add this to your imports at the top
// ...

// 🔧 INIT APP
const app = express();

// ===============================
// 🔧 GLOBAL MIDDLEWARE
// ===============================

// 🛡️ CORS FIX: Allowing Vercel and Localhost
app.use(cors({
  origin: [
    "http://localhost:5173", // Allows your local laptop to connect
    "https://eduai-dashboard.vercel.app" // ALLOWS VERCEL TO CONNECT
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ===============================
// 🔗 DATABASE CONNECTION (SAFE)
// ===============================
const connectDB = async () => {
  try {
    // 🛑 Removed the local fallback. If it can't find Atlas, it will crash and tell us!
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from your .env file!");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected to ATLAS CLOUD");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

connectDB();

// ===============================
// 📡 ROUTES
// ===============================

// 🔑 AUTH ROUTES
app.use("/api/auth", authRoutes);

// 📚 STUDENT ROUTES
app.use("/api/students", studentRoutes);

app.use("/api/messages", messageRoutes); // Add this under your student routes

// ===============================
// 🧪 HEALTH CHECK
// ===============================
app.get("/", (req, res) => {
  res.status(200).json({
    message: "🚀 EduAI Backend Running",
  });
});

// ===============================
// ❗ HANDLE UNKNOWN ROUTES
// ===============================
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// ===============================
// ❗ GLOBAL ERROR HANDLER
// ===============================
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.stack);

  res.status(err.status || 500).json({
    message: err.message || "Server Error",
  });
});

// ===============================
// 🚀 START SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});