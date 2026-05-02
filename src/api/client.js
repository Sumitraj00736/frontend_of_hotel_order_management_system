import axios from 'axios';
import { clearSession, getToken, getBranchId, getBranches, setBranchId } from './session.js';

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
    if (error?.response?.status === 403 && ['PLAN_LIMIT_REACHED', 'SUBSCRIPTION_EXPIRED', 'FEATURE_LOCKED'].includes(error.response.data?.code)) {
      // Global event for plan/subscription issues
      window.dispatchEvent(new CustomEvent('app:plan-limit-reached', { detail: error.response.data }));
    }
    if (error?.response?.status === 401) {
      // Clear potentially stale credentials and let routing redirect to login
      clearSession();
    }
    return Promise.reject(error);
  }
);

export default api;
