const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const progressRoutes = require("./routes/progressRoutes");
const nutritionRoutes = require("./routes/nutritionRoutes");
const aiRoutes = require("./routes/aiRoutes");
const dietRoutes = require("./routes/dietRoutes");

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let mongoConnected = false;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.log("No MONGODB_URI found");
      return;
    }
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 30000,
    });
    mongoConnected = true;
    console.log("MongoDB Connected");
  } catch (err) {
    console.log("MongoDB Connection Error:", err.message);
    mongoConnected = false;
  }
};

connectDB();

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "FitFat API is running",
    mongo: mongoConnected ? "connected" : "disconnected"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/diet", dietRoutes);

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`FitFat Server running on port ${PORT}`));

module.exports = app;