import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { ENV } from '../config/env.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { registerSessionHandlers } from './sessionHandlers.js';
import { logger } from '../utils/logger.js';

export function setupSocketServer(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: [ENV.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
    },
  });

  // Socket Auth Middleware
  io.use((socket: Socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '') ||
        (socket.handshake.query?.token as string);

      if (token) {
        const payload = verifyAccessToken(token);
        socket.data.user = payload;
      }
      // Allow connection even without token (e.g. projector screen / read-only TV mode)
      next();
    } catch (error) {
      // Allow anonymous connection with undefined user (projector view)
      next();
    }
  });

  io.on('connection', (socket: Socket) => {
    logger.info({ socketId: socket.id, user: socket.data.user?.email }, 'Socket connected');
    registerSessionHandlers(io, socket);

    socket.on('disconnect', () => {
      logger.info({ socketId: socket.id }, 'Socket disconnected');
    });
  });

  return io;
}

