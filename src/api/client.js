import axios from 'axios';
import { getToken, getBranchId, getBranches, setBranchId } from './session.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://hotel-order-management-system.onrender.com'
});

api.interceptors.request.use((config) => {
  const token = getToken();
  let branchId = getBranchId();
  if (!branchId) {
    const branches = getBranches();
    if (branches.length > 0) {
      branchId = branches[0].branchId || branches[0]._id;
      if (branchId) setBranchId(branchId);
    }
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (branchId) {
    config.headers['x-branch-id'] = branchId;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Clear potentially stale credentials and let routing redirect to login
      localStorage.removeItem('hotel_token');
      localStorage.removeItem('hotel_user');
    }
    return Promise.reject(error);
  }
);

export default api;
