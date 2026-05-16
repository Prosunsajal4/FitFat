# FitFat - AI-Powered Gym & Fitness Tracker

## Project Overview
- **Project Name**: FitFat
- **Type**: Full-stack fitness tracking web application
- **Core Functionality**: AI-powered gym tracker with workout logging, nutrition tracking, progress analysis, and personalized AI coaching
- **Target Users**: Fitness enthusiasts, gym-goers, bodybuilders, and people wanting to track their fitness journey

## Tech Stack
- **Frontend**: Next.js (JavaScript only - NO TypeScript)
- **Backend**: Node.js + Express.js (separate REST API)
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Authentication**: JWT (JSON Web Tokens)
- **Animations**: Framer Motion
- **AI Integration**: OpenAI API (GPT-3.5)

## UI/UX Specification

### Color Palette
- **Background Primary**: #0a0a0a (Deep black)
- **Background Secondary**: #1a1a1a (Charcoal)
- **Background Card**: rgba(30, 30, 30, 0.7) (Glassmorphism)
- **Neon Green**: #39ff14 (Primary accent)
- **Neon Purple**: #b026ff (Secondary accent)
- **Text Primary**: #ffffff
- **Text Secondary**: #a0a0a0
- **Success**: #00ff88
- **Warning**: #ffaa00
- **Error**: #ff4444

### Typography
- **Heading Font**: "Orbitron" (Google Fonts) - Futuristic, fitness-oriented
- **Body Font**: "Inter" (Google Fonts) - Clean, readable
- **Heading Sizes**: H1: 48px, H2: 36px, H3: 24px, H4: 20px
- **Body Size**: 16px base, 14px small

### Layout Structure
- **Sidebar**: Fixed left sidebar (280px desktop, collapsible on mobile)
- **Main Content**: Fluid width with max-width 1400px
- **Responsive Breakpoints**: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)

### Visual Effects
- **Glassmorphism**: backdrop-blur(12px), semi-transparent backgrounds
- **Neon Glow**: box-shadow with green/purple glow effects
- **Gradient Accents**: Linear gradients from green to purple
- **Animations**: Smooth transitions (0.3s ease), fade-in, slide-up

## Pages & Components

### 1. Authentication Pages
- **Login Page** (`/login`)
  - Email/password form
  - "Remember me" checkbox
  - Link to register
  - Neon border glow on focus

- **Register Page** (`/register`)
  - Name, email, password, confirm password
  - Goal selection (bulking/cutting/maintenance)
  - Experience level (beginner/intermediate/advanced)

### 2. Dashboard (`/dashboard`)
**Card Components**:
- Workout streak counter (days)
- Total workouts completed
- Weekly calories burned
- Current weight with trend arrow
- Fitness consistency score (0-100 circular progress)
- Muscle balance score

**Widget Components**:
- Weekly workout bar chart
- Weight progress line chart
- AI suggestion card with personalized recommendation
- Water intake tracker (8 glasses default)
- Quick action buttons

### 3. Workout Tracker (`/workouts`)
- **Workout List**: Card-based list of all workouts
- **Create Workout Modal**:
  - Workout name input
  - Exercise name input
  - Sets, reps, weight inputs
  - Add/remove exercise buttons
- **Workout History**: Table view with date, name, exercises, total volume
- **Real-time Stats**: Current session volume calculation

### 4. AI Workout Generator (`/ai-workout`)
**Input Form**:
- Goal (bulking/cutting/strength/fat loss)
- Weight, height, age inputs
- Experience level selector
- Equipment availability checkboxes

**Output Display**:
- Weekly split table
- Daily exercise recommendations
- Sets/reps guidance
- Rest day scheduling
- "Start Workout" button

### 5. Body Progress (`/progress`)
**Tracking Form**:
- Weight, chest, arms, waist, body fat % inputs
- Date selector
- Save measurement button

**Visualizations**:
- Weight trend line chart
- Body measurements comparison
- Timeline transformation view
- Before/after photo placeholder

### 6. Nutrition Tracker (`/nutrition`)
**Daily Log**:
- Meal inputs (breakfast, lunch, dinner, snacks)
- Calories, protein, carbs, fats per meal
- Water intake counter

**AI Recommendations**:
- Daily calorie target
- Protein target (based on goal)
- Warning alerts for over/under eating

### 7. AI Fitness Coach (`/coach`)
**Chat Interface**:
- Message history (scrollable)
- User input with send button
- Typing indicator
- Quick question suggestions

**Features**:
- Personalized responses using workout data
- Motivational messaging
- Workout advice
- Nutrition guidance

### 8. Muscle Balance Analyzer (`/muscle-balance`)
**Analysis Display**:
- Body diagram with heat map
- Muscle group volume bars
- Overtrained/neglected warnings
- Balance score percentage

### 9. Analytics Dashboard (`/analytics`)
**Charts**:
- Workout frequency (weekly/monthly)
- Calories burned trend
- Muscle group distribution pie chart
- Weight progress graph
- Workout intensity line chart

### 10. Profile & Settings (`/profile`)
- User info display
- Goal adjustment
- Theme preferences
- Data export option

## Backend API Structure

### Authentication Routes (`/api/auth`)
- `POST /register` - Create new user
- `POST /login` - Authenticate user
- `GET /me` - Get current user

### User Routes (`/api/users`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `PUT /stats` - Update user stats (streak, xp, level)

### Workout Routes (`/api/workouts`)
- `GET /` - Get all workouts
- `POST /` - Create workout
- `GET /:id` - Get single workout
- `PUT /:id` - Update workout
- `DELETE /:id` - Delete workout
- `GET /stats` - Get workout statistics

### Progress Routes (`/api/progress`)
- `GET /` - Get all progress entries
- `POST /` - Add progress entry
- `GET /latest` - Get latest entry
- `GET /chart` - Get chart data

### Nutrition Routes (`/api/nutrition`)
- `GET /today` - Get today's nutrition
- `POST /` - Log meal
- `PUT /water` - Update water intake

### AI Routes (`/api/ai`)
- `POST /workout-plan` - Generate workout plan
- `POST /chat` - AI chat message
- `POST /recommendations` - Get personalized recommendations

## Data Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  goal: String (bulking/cutting/maintenance),
  experience: String (beginner/intermediate/advanced),
  stats: {
    streak: Number,
    totalWorkouts: Number,
    xp: Number,
    level: Number,
    badges: [String]
  },
  body: {
    weight: Number,
    height: Number,
    age: Number,
    bodyFat: Number
  },
  createdAt: Date
}
```

### Workout
```javascript
{
  user: ObjectId (ref: User),
  name: String,
  exercises: [{
    name: String,
    sets: Number,
    reps: Number,
    weight: Number,
    completed: Boolean,
    notes: String
  }],
  totalVolume: Number,
  caloriesBurned: Number,
  duration: Number,
  date: Date,
  createdAt: Date
}
```

### Progress
```javascript
{
  user: ObjectId (ref: User),
  weight: Number,
  chest: Number,
  arms: Number,
  waist: Number,
  bodyFat: Number,
  date: Date,
  createdAt: Date
}
```

### Nutrition
```javascript
{
  user: ObjectId (ref: User),
  date: Date,
  meals: [{
    type: String,
    name: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number
  }],
  waterIntake: Number,
  createdAt: Date
}
```

## Gamification System

### Levels
- Beginner (0-100 XP)
- Intermediate (101-500 XP)
- Advanced (501-1000 XP)
- Pro (1001-2500 XP)
- Beast (2501-5000 XP)
- Legend (5001+ XP)

### XP System
- Complete workout: +50 XP
- Log nutrition: +10 XP
- Maintain streak: +20 XP per day
- Reach goal: +100 XP

### Badges
- "7-Day Streak" - Workout 7 days in a row
- "30 Workouts" - Complete 30 total workouts
- "Consistency Master" - 90%+ consistency for 30 days
- "First AI Plan" - Use AI workout generator
- "Nutrition Pro" - Log nutrition for 7 days

## Acceptance Criteria

### Authentication
- [ ] User can register with email/password
- [ ] User can login and receive JWT token
- [ ] Protected routes redirect to login if not authenticated
- [ ] Token persists in localStorage

### Dashboard
- [ ] All stat cards display with real data
- [ ] Charts render with workout data
- [ ] AI suggestion shows personalized recommendation
- [ ] Water tracker is interactive

### Workout Tracker
- [ ] User can create new workout with exercises
- [ ] Can add/remove exercises in workout
- [ ] Can mark sets as completed
- [ ] Volume calculates in real-time
- [ ] Can view workout history

### AI Features
- [ ] AI workout generator produces valid plan
- [ ] AI chat responds to fitness questions
- [ ] Recommendations are personalized

### Progress Tracking
- [ ] Can log body measurements
- [ ] Charts show progress over time
- [ ] Data persists in database

### Nutrition
- [ ] Can log meals with macros
- [ ] Water tracker updates
- [ ] Daily totals calculate correctly

### UI/UX
- [ ] Dark theme applied throughout
- [ ] Neon green/purple accents visible
- [ ] Glassmorphism cards render correctly
- [ ] Animations smooth and functional
- [ ] Fully responsive on mobile/tablet/desktop

### Performance
- [ ] Pages load under 3 seconds
- [ ] No console errors in production
- [ ] API responses under 500ms