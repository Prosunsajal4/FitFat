import axios from 'axios';

const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const workoutAPI = {
  getWorkouts: (params) => api.get('/workouts', { params }),
  getWorkout: (id) => api.get(`/workouts/${id}`),
  createWorkout: (data) => api.post('/workouts', data),
  updateWorkout: (id, data) => api.put(`/workouts/${id}`, data),
  deleteWorkout: (id) => api.delete(`/workouts/${id}`),
  getStats: () => api.get('/workouts/stats'),
};

export const progressAPI = {
  getProgress: (params) => api.get('/progress', { params }),
  addProgress: (data) => api.post('/progress', data),
  getLatest: () => api.get('/progress/latest'),
  getChart: (params) => api.get('/progress/chart', { params }),
  getPredictions: () => api.get('/progress/predictions'),
  deleteProgress: (id) => api.delete(`/progress/${id}`),
};

export const nutritionAPI = {
  getToday: () => api.get('/nutrition/today'),
  addMeal: (data) => api.post('/nutrition/meal', data),
  updateWater: (data) => api.put('/nutrition/water', data),
  getHistory: (params) => api.get('/nutrition/history', { params }),
  updateTargets: (data) => api.put('/nutrition/targets', data),
  getWeekly: () => api.get('/nutrition/weekly'),
};

export const aiAPI = {
  generateWorkoutPlan: (data) => api.post('/ai/workout-plan', data),
  chat: (message) => api.post('/ai/chat', { message }),
  getChatHistory: () => api.get('/ai/chat'),
  clearChat: () => api.delete('/ai/chat'),
  getRecommendations: () => api.get('/ai/recommendations'),
};

export default api;