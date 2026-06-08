const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const progressRoutes = require("./routes/progressRoutes");
const nutritionRoutes = require("./routes/nutritionRoutes");
const aiRoutes = require("./routes/aiRoutes");
const dietRoutes = require("./routes/dietRoutes");
const prRoutes = require("./routes/prRoutes");

const app = express();

app.use(cors({
  origin: [
    'https://fitfat-sooty.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let mongoConnected = false;
let mongoConnecting = false;
let mongoConnectPromise = null;

const connectDB = async () => {
  if (mongoConnected) return true;
  if (mongoConnecting && mongoConnectPromise) return mongoConnectPromise;

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log("No MONGODB_URI found");
    return false;
  }

  mongoConnecting = true;
  mongoConnectPromise = mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 30000,
    maxPoolSize: 10,
  }).then(() => {
    mongoConnected = true;
    mongoConnecting = false;
    console.log("MongoDB Connected");
    return true;
  }).catch((err) => {
    console.log("MongoDB Connection Error:", err.message);
    mongoConnected = false;
    mongoConnecting = false;
    mongoConnectPromise = null;
    return false;
  });

  return mongoConnectPromise;
};

const ensureDB = async (req, res, next) => {
  if (mongoConnected) return next();
  const connected = await connectDB();
  if (connected) return next();
  res.status(503).json({ message: "Database not available. Please try again." });
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected, will reconnect on next request');
  mongoConnected = false;
});

mongoose.connection.on('error', (err) => {
  console.log('MongoDB error:', err.message);
  mongoConnected = false;
});

connectDB();

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "FitFat API is running",
    mongo: mongoConnected ? "connected" : "disconnected"
  });
});

app.use("/api/auth", ensureDB, authRoutes);
app.use("/api/workouts", ensureDB, workoutRoutes);
app.use("/api/progress", ensureDB, progressRoutes);
app.use("/api/nutrition", ensureDB, nutritionRoutes);
app.use("/api/ai", ensureDB, aiRoutes);
app.use("/api/diet", ensureDB, dietRoutes);
app.use("/api/prs", ensureDB, prRoutes);

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`FitFat Server running on port ${PORT}`));

module.exports = app;