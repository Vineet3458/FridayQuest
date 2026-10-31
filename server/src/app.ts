import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

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
import analyticsRoutes from './modules/analytics/routes.js';
import approvalsRoutes from './modules/approvals/routes.js';

export function createApp(): Express {
  const app = express();

  // Security Middleware
  app.use(helmet());
  app.use(
    cors({
      origin: ENV.CORS_ORIGINS,
      credentials: true,
    })
  );

  // Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser(ENV.COOKIE_SECRET));

  // Rate limiting disabled per user request for seamless testing and high-frequency logins

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
  app.use('/api/v1/analytics', analyticsRoutes);
  app.use('/api/v1/approvals', approvalsRoutes);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
