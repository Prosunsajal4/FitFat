# API Endpoints

## Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/forgot-password` - Send reset email
- `POST /api/auth/reset-password/:token` - Reset password

## Workouts
- `GET /api/workouts` - Get all workouts
- `POST /api/workouts` - Create workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout

## Progress
- `GET /api/progress` - Get progress entries
- `POST /api/progress` - Add progress entry
- `DELETE /api/progress/:id` - Delete entry

## Nutrition
- `GET /api/nutrition` - Get meals
- `POST /api/nutrition` - Add meal
- `DELETE /api/nutrition/meal/:mealId` - Delete meal

## AI
- `POST /api/ai/workout-plan` - Generate workout plan
- `POST /api/ai/chat` - Chat with AI coach
- `POST /api/ai/diet-plan` - Generate diet plan

## Personal Records
- `GET /api/pr` - Get all PRs
- `POST /api/pr` - Create PR
- `PUT /api/pr/:id` - Update PR

## Diet
- `GET /api/diet/plan` - Get diet plan
- `GET /api/diet/plan/:workoutType` - Get plan for workout type
