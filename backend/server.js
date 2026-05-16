require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const progressRoutes = require("./routes/progressRoutes");
const nutritionRoutes = require("./routes/nutritionRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://fitfat-sooty.vercel.app",
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "FitFat API is running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/ai", aiRoutes);

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: "Server error" });
});

module.exports = app;