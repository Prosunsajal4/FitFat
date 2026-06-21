# FitFat - AI-Powered Gym & Fitness Tracker

## Tech Stack
- **Frontend:** Next.js, React, Framer Motion, Tailwind CSS
- **Backend:** Express.js, MongoDB, Mongoose, JWT
- **AI:** Gemini API

## Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env  # Configure your env vars
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Development (both)
```bash
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_key
PORT=5000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Scripts
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build frontend for production
- `npm run test` - Run backend tests
- `npm run lint` - Lint frontend code
- `npm run clean` - Clean build artifacts
