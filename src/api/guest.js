import api from './client.js';

export const fetchGuestMenu = () => api.get('/api/guest/menu');
export const fetchGuestStatus = (tableId) => api.get(`/api/guest/tables/${tableId}/status`);
export const createGuestOrder = (payload) => api.post('/api/guest/orders', payload);
