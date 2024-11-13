import axios from 'axios';

// Create an Axios instance with default configurations
const api = axios.create({
  baseURL: 'https://localhost:443/api',
  headers: { 'Content-Type': 'application/json' },
});

// Add a request interceptor to include the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
