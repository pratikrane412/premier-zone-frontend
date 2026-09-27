import axios from 'axios';

const isProduction = 
  Boolean(import.meta.env.PROD) || 
  (typeof window !== 'undefined' && 
   window.location.hostname !== 'localhost' && 
   window.location.hostname !== '127.0.0.1');

const envUrl = import.meta.env.VITE_API_URL;

const API_BASE_URL = 
  (envUrl && (!isProduction || !envUrl.includes('localhost')))
    ? envUrl
    : (isProduction ? 'https://premier-backend.onrender.com' : 'http://localhost:8000');

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token automatically
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthorized responses
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired/invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default client;
export { API_BASE_URL };
