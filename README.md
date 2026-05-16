# FitFat - AI-Powered Gym & Fitness Tracker 🇧🇩

A full-stack fitness tracking application with AI-powered features, Bangladeshi diet plans, and gamification built with MERN stack.

## 🔗 Live Demo

- **Frontend**: https://fitfat-sooty.vercel.app
- **Backend API**: https://fitfatbackend.vercel.app

## ✨ Features

### Core Features
- 🏋️ **Workout Tracker** - Log exercises, sets, reps, weight with real-time volume calculation
- 🤖 **AI Workout Generator** - Personalized weekly workout plans using Google Gemini AI
- 📈 **Progress Tracking** - Weight, body measurements, body fat percentage with charts
- 🥗 **Nutrition Tracker** - Meals, calories, protein, carbs, fats, water intake
- 🍛 **Bangladeshi Diet Plan** - Local food-based meal plans for different workout days (ভাত, মাছ, ডাল, রুটি, ইলিশ, etc.)
- 💬 **AI Fitness Coach** - Chat with AI for personalized fitness advice
- ⚖️ **Muscle Balance Analyzer** - Track trained vs neglected muscle groups
- 📊 **Analytics Dashboard** - Beautiful charts and statistics
- 🔥 **Gamification** - XP system, levels, streaks, achievement badges
- 👤 **Profile Management** - Update personal info, goals, body stats

### UI/UX
- 🌙 **Dark Theme** - Modern glassmorphism UI with neon green/purple accents
- 📱 **Fully Responsive** - Mobile-friendly with collapsible sidebar
- ✨ **Smooth Animations** - Framer Motion animations throughout
- 🎨 **Beautiful Charts** - Chart.js for data visualization

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Framer Motion, Chart.js, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **AI**: Google Gemini API
- **Deployment**: Vercel

## 👨‍💻 Developer

**Prosun Mukherjee** - MERN Stack Developer
- 📧 prosunsajal123@gmail.com
- 📱 +8801911572117
- 📍 Khulna, Bangladesh
- 🔗 [GitHub](https://github.com/Prosunsajal4)
- 🔗 [LinkedIn](https://linkedin.com/in/prosun-mukherjee)
- 🔗 [Portfolio](https://prosun-mukherjee.vercel.app)

## 📋 Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB** (v4.4 or higher) - Local or MongoDB Atlas
3. **npm** (comes with Node.js)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Prosunsajal4/FitFat.git
cd FitFat
```

### 2. Configure Environment

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
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

## 🏃 Running the Application

### Development

**Start Backend (Terminal 1)**
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

**Start Frontend (Terminal 2)**
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

### Production

The application is deployed on Vercel:
- Frontend: https://fitfat-sooty.vercel.app
- Backend: https://fitfatbackend.vercel.app

## 📁 Project Structure

```
FitFat/
├── backend/
│   ├── config/          # Database config
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions (diet plans)
│   └── server.js        # Entry point
│
└── frontend/
    ├── components/      # React components
    ├── context/         # Auth context
    ├── pages/           # Next.js pages
    ├── services/        # API service
    └── styles/          # Global CSS
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Workouts
- `GET /api/workouts` - Get all workouts
- `POST /api/workouts` - Create workout
- `GET /api/workouts/:id` - Get single workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout
- `GET /api/workouts/stats` - Get workout statistics

### Diet Plan 🇧🇩
- `GET /api/diet?workoutType=Push` - Get Bangladeshi diet plan for workout day

### Progress
- `GET /api/progress` - Get progress entries
- `POST /api/progress` - Add progress entry
- `GET /api/progress/latest` - Get latest entry
- `GET /api/progress/chart` - Get chart data
- `GET /api/progress/predictions` - Get progress predictions

### Nutrition
- `GET /api/nutrition/today` - Get today's nutrition
- `POST /api/nutrition/meal` - Add meal
- `PUT /api/nutrition/water` - Update water intake
- `GET /api/nutrition/weekly` - Get weekly stats

### AI
- `POST /api/ai/workout-plan` - Generate workout plan
- `POST /api/ai/chat` - Chat with AI
- `GET /api/ai/recommendations` - Get AI recommendations

## 🍛 Bangladeshi Diet Plans

Customized meal plans for each workout day with local foods:

| Workout Day | Breakfast | Lunch | Dinner |
|-------------|-----------|-------|--------|
| **Push** | ডিম ভাজি + রুটি + কলা | ভাত + মাছ + ডাল + সবজি | রুটি + মুরগি + সালাদ |
| **Pull** | পরোটা + ডিম + চা | ভাত + ইলিশ মাছ + ডাল | ভাত + গোশত + ডাল |
| **Legs** | ওটস + ডিম + কলা | ভাত + মুরগি + ডাল | রুটি + মাছ + সালাদ |
| **Full Body** | পরোটা + ডিম + দুধ | ভাত + মুরগি + ডাল | রুটি + মাছ + সালাদ |
| **Cardio** | ওটস + ডিম + ফল | ভাত + মাছ + ডাল | সুপ + রুটি + সালাদ |
| **Rest** | রুটি + ডিম + চা | ভাত + ডাল + সবজি | সুপ + রুটি + সালাদ |

## 📸 Screenshots

- Landing page with hero section
- Dashboard with stats and charts
- Workout tracker with exercise logging
- AI workout generator
- Bangladeshi diet plan page
- Progress tracking with charts
- Nutrition tracker
- AI fitness coach chat
- Muscle balance analyzer
- Profile page with gamification

## 📝 License

MIT © 2026 FitFat - Built by Prosun Mukherjee with ❤️