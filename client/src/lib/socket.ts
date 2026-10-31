import { io, Socket } from 'socket.io-client';
import { getStoredToken } from './api';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export function getSocket(token?: string): Socket {
  const authToken = token || getStoredToken();
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      auth: authToken ? { token: authToken } : undefined,
      autoConnect: false,
    });
  }
  return socket;
}

export function connectSocket(token?: string): Socket {
  const s = getSocket(token);
  if (!s.connected) {
    s.connect();
  }
  return s;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

