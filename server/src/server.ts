import http from 'http';
import mongoose from 'mongoose';
import { createApp } from './app.js';
import { setupSocketServer } from './sockets/index.js';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';
import { logger } from './utils/logger.js';
import { seedTwentyUsers } from './seed/seedUsers.js';
import { seedGames } from './seed/seedGames.js';
import { seedFullDemo } from './seed/seedFullDemo.js';

async function bootstrap() {
  await connectDB();

  if (ENV.NODE_ENV !== 'production') {
    try {
      await seedGames();
      await seedTwentyUsers();
      await seedFullDemo();
    } catch (seedErr) {
      logger.warn({ seedErr }, 'Development seed data was not loaded.');
    }
  }

  const app = createApp();
  const httpServer = http.createServer(app);

  setupSocketServer(httpServer);

  httpServer.listen(ENV.PORT, () => {
    logger.info(`FridayQuest Server is running on http://localhost:${ENV.PORT}`);
    logger.info(`Health check available at http://localhost:${ENV.PORT}/api/v1/health`);
  });

  // Graceful shutdown handler for production orchestration (Docker, K8s, Cloud Run)
  const gracefulShutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Initiating graceful shutdown...`);
    httpServer.close(async () => {
      logger.info('HTTP server closed.');
      try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed.');
        process.exit(0);
      } catch (err) {
        logger.error({ err }, 'Error closing MongoDB connection');
        process.exit(1);
      }
    });

    setTimeout(() => {
      logger.error('Forced shutdown due to timeout (10s)');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

bootstrap().catch((err) => {
  logger.error({ err }, 'Fatal error during server bootstrap');
  process.exit(1);
});
