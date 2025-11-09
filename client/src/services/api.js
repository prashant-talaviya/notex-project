import axios from 'axios';

// Use proxy in development, or explicit URL in production
const API_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (name, email, password) => 
    api.post('/auth/register', { name, email, password }),
  
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  getProfile: () => 
    api.get('/auth/profile'),
  
  updateProfile: (name, password) => 
    api.put('/auth/profile', { name, password })
};

// Notes API
export const notesAPI = {
  getNotes: () => 
    api.get('/notes'),
  
  getNote: (id) => 
    api.get(`/notes/${id}`),
  
  createNote: (title, content) => 
    api.post('/notes', { title, content }),
  
  updateNote: (id, title, content) => 
    api.put(`/notes/${id}`, { title, content }),
  
  deleteNote: (id) => 
    api.delete(`/notes/${id}`),
  
  uploadPDF: (file, title) => {
    const formData = new FormData();
    formData.append('pdf', file);
    if (title) formData.append('title', title);
    return api.post('/notes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

// Chat API
export const chatAPI = {
  chatWithNote: (noteId, question) => 
    api.post(`/chat/${noteId}`, { question }),
  
  getChatHistory: (noteId) => 
    api.get(`/chat/${noteId}/history`),
  
  getConversationsCount: () => 
    api.get('/chat/stats/conversations')
};

// Quick Notes API
export const quickNotesAPI = {
  getQuickNotes: () => 
    api.get('/quicknotes'),
  
  createQuickNote: (content) => 
    api.post('/quicknotes', { content }),
  
  updateQuickNote: (id, content) => 
    api.put(`/quicknotes/${id}`, { content }),
  
  deleteQuickNote: (id) => 
    api.delete(`/quicknotes/${id}`)
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => 
    api.get('/dashboard/stats')
};

// AI API
export const aiAPI = {
  performAction: (action, noteId) => 
    api.post('/ai/action', { action, noteId }),
  
  generalChat: (question) => 
    api.post('/ai/general-chat', { question })
};

export default api;

