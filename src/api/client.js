import axios from 'axios';
import { clearSession, getToken, getBranchId, getBranches, setBranchId, getRefreshToken, getAuthProvider, getCurrentUser } from './session.js';

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
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 403 && ['PLAN_LIMIT_REACHED', 'SUBSCRIPTION_EXPIRED', 'FEATURE_LOCKED'].includes(error.response.data?.code)) {
      // Global event for plan/subscription issues
      window.dispatchEvent(new CustomEvent('app:plan-limit-reached', { detail: error.response.data }));
    }

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();
      const provider = getAuthProvider();

      // Only attempt backend refresh if we are using the backend provider
      if (provider === 'backend' && refreshToken) {
        try {
          const res = await axios.post(`${import.meta.env.VITE_API_URL || 'https://hotel-order-management-system.onrender.com'}/api/auth/refresh`, {
            refreshToken
          });

          if (res.status === 200) {
            const { token, refreshToken: newRefreshToken } = res.data;
            const branches = getBranches();
            const user = getCurrentUser();
            
            // Save new tokens
            localStorage.setItem('hotel_token', token);
            localStorage.setItem('hotel_refresh_token', newRefreshToken);

            // Update original request
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          clearSession();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else if (provider === 'firebase') {
        // Handle Firebase token refresh
        try {
          const { auth } = await import('../utils/firebase');
          const user = auth.currentUser;
          if (user) {
            const newToken = await user.getIdToken(true);
            localStorage.setItem('hotel_token', newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        } catch (fbRefreshError) {
          clearSession();
          window.location.href = '/login';
          return Promise.reject(fbRefreshError);
        }
      }

      // If no refresh possible, clear session
      clearSession();
    }

    return Promise.reject(error);
  }
);

export default api;
