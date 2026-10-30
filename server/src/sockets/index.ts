import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { ENV } from '../config/env.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { registerSessionHandlers } from './sessionHandlers.js';
import { SessionState } from '../models/SessionState.js';
import { logger } from '../utils/logger.js';
import { User } from '../models/User.js';
import { AuthUserPayload } from '../types/index.js';

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
      origin: ENV.CORS_ORIGINS,
      credentials: true,
    },
  });

  ioInstance = io;

  // Socket Auth Middleware
  io.use(async (socket: Socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie || '';
      const accessCookie = cookieHeader
        .split(';')
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith('access_token='))
        ?.slice('access_token='.length);
      const token =
        socket.handshake.auth?.token ||
        (socket.handshake.headers.authorization?.startsWith('Bearer ')
          ? socket.handshake.headers.authorization.slice('Bearer '.length)
          : undefined) ||
        (accessCookie ? decodeURIComponent(accessCookie) : undefined);

      if (token) {
        const payload = verifyAccessToken(token);
        const user = await User.findById(payload.userId).select('_id orgId role email status +tokenVersion');
        if (
          !user ||
          user.status !== 'active' ||
          (payload.tokenVersion ?? 0) !== (user.tokenVersion ?? 0)
        ) {
          next(new Error('Unauthorized'));
          return;
        }
        const authUser: AuthUserPayload = {
          userId: user._id.toString(),
          orgId: user.orgId.toString(),
          role: user.role,
          email: user.email,
        };
        socket.data.user = authUser;
      }
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket: Socket) => {
    logger.info({ socketId: socket.id, user: socket.data.user?.email }, 'Socket connected');

    if (socket.data.user?.orgId) {
      socket.join(`org:${socket.data.user.orgId}`);
    }
    if (socket.data.user?.userId) {
      socket.join(`user:${socket.data.user.userId}`);
    }

    socket.on('dashboard:join', () => {
      if (socket.data.user?.orgId) {
        socket.join(`org:${socket.data.user.orgId}`);
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
