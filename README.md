# FitFat - AI-Powered Gym & Fitness Tracker

A full-stack fitness tracking application with AI-powered features.

## Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB** (v4.4 or higher) - Can be installed locally or use MongoDB Atlas
3. **npm** (comes with Node.js)

## Installation

### 1. Install MongoDB

**Option A: Local Installation**
- Download from: https://www.mongodb.com/try/download/community
- Install and start the service

**Option B: MongoDB Atlas (Cloud)**
- Create free account at https://www.mongodb.com/atlas/database
- Create a free cluster and get connection string

### 2. Configure Environment

Edit `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitfat
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_api_key
```

### 3. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Running the Application

### Start Backend (Terminal 1)
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

## Features

- 🏋️ **Workout Tracker** - Log exercises, sets, reps, weight
- 🤖 **AI Workout Generator** - Personalized workout plans
- 📈 **Progress Tracking** - Weight, measurements, body stats
- 🥗 **Nutrition Tracker** - Calories, macros, water intake
- 💬 **AI Fitness Coach** - Chat with AI for fitness advice
- 📊 **Analytics Dashboard** - Charts and statistics
- 🔥 **Gamification** - XP, levels, streaks, badges

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Framer Motion, Chart.js
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT
- **AI**: OpenAI GPT-3.5

## Project Structure

```
FitFat/
├── backend/
│   ├── config/       # Database config
│   ├── controllers/ # Business logic
│   ├── middleware/   # Auth middleware
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   └── server.js     # Entry point
│
└── frontend/
    ├── components/   # React components
    ├── context/      # Auth context
    ├── pages/        # Next.js pages
    ├── services/     # API service
    └── styles/       # Global CSS
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Workouts
- GET `/api/workouts` - Get all workouts
- POST `/api/workouts` - Create workout
- GET `/api/workouts/stats` - Get workout statistics

### Progress
- GET `/api/progress` - Get progress entries
- POST `/api/progress` - Add progress entry
- GET `/api/progress/chart` - Get chart data

### Nutrition
- GET `/api/nutrition/today` - Get today's nutrition
- POST `/api/nutrition/meal` - Add meal
- PUT `/api/nutrition/water` - Update water intake

### AI
- POST `/api/ai/workout-plan` - Generate workout plan
- POST `/api/ai/chat` - Chat with AI

## License

MIT