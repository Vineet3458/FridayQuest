import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { ENV } from './config/env.js';
import { errorHandler } from './middleware/error.js';

// Route imports
import authRoutes from './modules/auth/routes.js';
import usersRoutes from './modules/users/routes.js';
import gamesRoutes from './modules/games/routes.js';
import sessionsRoutes from './modules/sessions/routes.js';
import vibeRoutes from './modules/vibe/routes.js';
import plannerRoutes from './modules/planner/routes.js';
import teamsRoutes from './modules/teams/routes.js';
import scoringRoutes from './modules/scoring/routes.js';
import ratingsRoutes from './modules/ratings/routes.js';
import recapRoutes from './modules/recap/routes.js';

export function createApp(): Express {
  const app = express();

  // Security Middleware
  app.use(helmet());
  app.use(
    cors({
      origin: [ENV.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
    })
  );

  // Parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(ENV.COOKIE_SECRET));

  // Rate Limiter on Auth
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 100,
    message: { success: false, message: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/v1/auth', authLimiter);

  // Health check route
  app.get('/api/v1/health', (_req, res) => {
    res.status(200).json({
      success: true,
      status: 'healthy',
      app: 'FridayQuest Backend',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  });

  // API v1 Routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', usersRoutes);
  app.use('/api/v1/games', gamesRoutes);
  app.use('/api/v1/sessions', sessionsRoutes);
  app.use('/api/v1/sessions/:id/vibe', vibeRoutes);
  app.use('/api/v1/sessions/:id/plan', plannerRoutes);
  app.use('/api/v1/sessions/:id/teams', teamsRoutes);
  app.use('/api/v1/sessions/:id/scores', scoringRoutes);
  app.use('/api/v1/sessions/:id/ratings', ratingsRoutes);
  app.use('/api/v1/sessions/:id/recap', recapRoutes);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}

