
import mongoose from 'mongoose';
import { config } from './config.js';

export async function connectDB() {
  mongoose.connection.on('connected', () => {
    console.log('[db] connected');
  });
  mongoose.connection.on('error', (err) => {
    console.error('[db] error', err);
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('[db] disconnected');
  });
  await mongoose.connect(config.mongoUri, {
    serverSelectionTimeoutMS: 5000
  });
  return mongoose.connection;
}
