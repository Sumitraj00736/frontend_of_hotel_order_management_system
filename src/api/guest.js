import api from './client.js';

const withBranch = (branchId) => (branchId ? { headers: { 'x-branch-id': branchId } } : {});

export const fetchGuestMenu = (branchId) => api.get('/api/guest/menu', withBranch(branchId));
export const fetchGuestStatus = (tableId, branchId) =>
  api.get(`/api/guest/tables/${tableId}/status`, withBranch(branchId));
export const createGuestOrder = (payload, branchId) =>
  api.post('/api/guest/orders', payload, withBranch(branchId));
