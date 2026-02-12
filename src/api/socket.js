import { io } from 'socket.io-client';
import { getCurrentUser } from './session.js';

export const createSocket = () => {
  const socket = io('http://localhost:4000');
  const user = getCurrentUser();
  if (user?.role) {
    socket.emit('join-role', user.role);
  }
  return socket;
};
