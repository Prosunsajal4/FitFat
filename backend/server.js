require("dotenv").config({ path: ".env" });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const progressRoutes = require("./routes/progressRoutes");
const nutritionRoutes = require("./routes/nutritionRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "FitFat API is running",
    mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/ai", aiRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitfat';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000
})
.then(() => {
  console.log("MongoDB Connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => {
  console.log("MongoDB Error:", err.message);
  app.listen(PORT, () => console.log(`Server running on port ${PORT} (DB not connected)`));
});

module.exports = app;