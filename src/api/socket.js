import { io } from 'socket.io-client';
import { getBranchId, getToken } from './session.js';

export const createSocket = () => {
  const token = getToken();
  const branchId = getBranchId();
  const socket = io(import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'https://hotel-order-management-system.onrender.com', {
    auth: token ? { token } : undefined
  });
  socket.on('connect', () => {
    socket.emit('join-role', { branchId });
  });
  return socket;
};
