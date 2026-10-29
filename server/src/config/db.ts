import mongoose from 'mongoose';
import { ENV } from './env.js';
import { logger } from '../utils/logger.js';

export async function connectDB(): Promise<void> {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(ENV.MONGO_URI);
    logger.info('Connected to MongoDB successfully');
  } catch (error) {
    logger.error({ error }, 'Failed to connect to MongoDB');
    // In development or test environments, we log the error but allow server startup if needed
  }
}

