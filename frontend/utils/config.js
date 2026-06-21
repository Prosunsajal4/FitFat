export const APP_NAME = 'FitFat';
export const APP_VERSION = '2.0.0';
export const APP_DESCRIPTION = 'AI-powered Gym & Fitness Tracker';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  WORKOUTS: '/workouts',
  PROGRESS: '/progress',
  NUTRITION: '/nutrition',
  COACH: '/coach',
  AI_WORKOUT: '/ai-workout',
  DIET: '/diet',
  ANALYTICS: '/analytics',
  MUSCLE_BALANCE: '/muscle-balance',
  PRS: '/prs',
  PROFILE: '/profile',
  SETTINGS: '/settings',
};

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'fitfat_token',
  THEME: 'fitfat_theme',
  LANGUAGE: 'fitfat_language',
  SIDEBAR: 'fitfat_sidebar',
};
