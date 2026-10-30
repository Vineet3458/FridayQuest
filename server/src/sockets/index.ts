import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { ENV } from '../config/env.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { registerSessionHandlers } from './sessionHandlers.js';
import { SessionState } from '../models/SessionState.js';
import { logger } from '../utils/logger.js';

let ioInstance: Server | null = null;
let timerTickerInterval: NodeJS.Timeout | null = null;

export function getIO(): Server {
  if (!ioInstance) {
    throw new Error('Socket.io server has not been initialized yet');
  }
  return ioInstance;
}

export function safeGetIO(): Server | null {
  return ioInstance;
}

export function setupSocketServer(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: [ENV.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
    },
  });

  ioInstance = io;

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

    // Auto-join dashboard real-time room
    socket.join('dashboard');
    if (socket.data.user?.orgId) {
      socket.join(`org:${socket.data.user.orgId}`);
    }

    // Explicit room joins
    socket.on('dashboard:join', (data?: { orgId?: string }) => {
      socket.join('dashboard');
      if (data?.orgId) {
        socket.join(`org:${data.orgId}`);
      }
      socket.emit('dashboard:connected', { status: 'live', timestamp: new Date().toISOString() });
    });

    registerSessionHandlers(io, socket);

    socket.on('disconnect', () => {
      logger.info({ socketId: socket.id }, 'Socket disconnected');
    });
  });

  // Start Server-Side Real-Time Timer Engine
  if (!timerTickerInterval) {
    timerTickerInterval = setInterval(async () => {
      try {
        const activeStates = await SessionState.find({
          status: 'in_progress',
          paused: false,
          'timers.running': true,
          'timers.endsAt': { $exists: true },
        });

        const now = Date.now();
        for (const state of activeStates) {
          if (!state.timers.endsAt) continue;
          const endsAtMs = new Date(state.timers.endsAt).getTime();
          const remainingSec = Math.max(0, Math.ceil((endsAtMs - now) / 1000));

          io.to(`session:${state.sessionId}`).emit('timer:tick', {
            remainingSec,
            endsAt: state.timers.endsAt,
          });

          if (remainingSec <= 0) {
            state.timers.running = false;
            await state.save();
            io.to(`session:${state.sessionId}`).emit('timer:expired', {
              sessionId: state.sessionId,
            });
            io.to(`session:${state.sessionId}`).emit('state:update', {
              timers: state.timers,
            });
          }
        }
      } catch (err) {
        // Suppress timer loop errors
      }
    }, 1000);
  }

  return io;
}
