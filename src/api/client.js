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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 403 && ['PLAN_LIMIT_REACHED', 'SUBSCRIPTION_EXPIRED', 'FEATURE_LOCKED'].includes(error.response.data?.code)) {
      window.dispatchEvent(new CustomEvent('app:plan-limit-reached', { detail: error.response.data }));
    }

    if (error?.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      const provider = getAuthProvider();

      if (provider === 'backend' && refreshToken) {
        try {
          const res = await axios.post(`${import.meta.env.VITE_API_URL || 'https://hotel-order-management-system.onrender.com'}/api/auth/refresh`, {
            refreshToken
          });

          if (res.status === 200) {
            const { token, refreshToken: newRefreshToken } = res.data;
            const branches = getBranches();
            const user = getCurrentUser();
            
            saveSession(token, user, branches, 'backend', newRefreshToken);
            processQueue(null, token);

            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          clearSession();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else if (provider === 'firebase') {
        try {
          const { auth } = await import('../utils/firebase');
          const user = auth.currentUser;
          if (user) {
            const newToken = await user.getIdToken(true);
            const branches = getBranches();
            const userData = getCurrentUser();
            
            saveSession(newToken, userData, branches, 'firebase');
            processQueue(null, newToken);

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        } catch (fbRefreshError) {
          processQueue(fbRefreshError, null);
          clearSession();
          window.location.href = '/login';
          return Promise.reject(fbRefreshError);
        } finally {
          isRefreshing = false;
        }
      }

      isRefreshing = false;
      clearSession();
    }

    return Promise.reject(error);
  }
);

export default api;
