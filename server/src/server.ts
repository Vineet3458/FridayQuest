import http from 'http';
import { createApp } from './app.js';
import { setupSocketServer } from './sockets/index.js';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';
import { logger } from './utils/logger.js';

async function bootstrap() {
  await connectDB();

  const app = createApp();
  const httpServer = http.createServer(app);

  setupSocketServer(httpServer);

  httpServer.listen(ENV.PORT, () => {
    logger.info(`FridayQuest Server is running on http://localhost:${ENV.PORT}`);
    logger.info(`Health check available at http://localhost:${ENV.PORT}/api/v1/health`);
  });
}

bootstrap().catch((err) => {
  logger.error({ err }, 'Fatal error during server bootstrap');
  process.exit(1);
});

