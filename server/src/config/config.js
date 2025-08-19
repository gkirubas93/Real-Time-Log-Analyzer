
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/realtime_logs',
  logGenerator: {
    enabled: (process.env.LOG_GENERATOR_ENABLED || 'true').toLowerCase() === 'true',
    intervalMs: parseInt(process.env.LOG_GENERATOR_RATE_MS || '1000', 10)
  },
  stats: {
    maxWindowSeconds: 3600
  }
};
