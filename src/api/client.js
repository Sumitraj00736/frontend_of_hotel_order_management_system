import axios from 'axios';
import { getToken } from './session.js';

const api = axios.create({
  baseURL: 'https://hotel-order-management-system.onrender.com'
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
