import { io } from 'socket.io-client';
import { getCurrentUser, getBranchId } from './session.js';

export const createSocket = () => {
  const socket = io(import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'https://hotel-order-management-system.onrender.com');
  const user = getCurrentUser();
  const branchId = getBranchId();
  if (user?.role) {
    socket.emit('join-role', { role: user.role, branchId });
  }
  return socket;
};
