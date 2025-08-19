
import { v4 as uuidv4 } from 'uuid';
import Log from '../models/Log.js';
import { config } from '../config/config.js';

const LEVELS = ['INFO', 'WARN', 'ERROR'];
const SERVICES = ['auth', 'payments', 'notifications'];
const MESSAGES = {
  INFO: [
    'User session validated',
    'Background job completed',
    'Healthcheck OK',
    'Cache refreshed successfully'
  ],
  WARN: [
    'High response time detected',
    'Retrying external API call',
    'Missing optional config, using defaults'
  ],
  ERROR: [
    'Database connection error',
    'Payment gateway timeout',
    'Unhandled exception in notification worker'
  ]
};

let timer = null;

export function startLogGenerator(io = null) {
  if (!config.logGenerator?.enabled) return;
  if (timer) return;

  const SERVICES = ['auth', 'payments', 'notifications'];

  timer = setInterval(async () => {
    try {
      // create random log
      const rnd = Math.random();
      const level = rnd < 0.7 ? 'INFO' : rnd < 0.9 ? 'WARN' : 'ERROR';
      const service = SERVICES[Math.floor(Math.random() * SERVICES.length)];
      const msgPool = MESSAGES[level];
      const message = msgPool[Math.floor(Math.random() * msgPool.length)];

      const log = {
        id: uuidv4(),
        timestamp: new Date(),
        level,
        service,
        message,
      };

      const created = await Log.create(log);

      // emit to clients
      if (io) {
        io.emit('log:new', {
          _id: created._id,
          id: created.id,
          timestamp: created.timestamp,
          level: created.level,
          service: created.service,
          message: created.message,
        });
      }
    } catch (err) {
      console.error('[generator] failed to create log', err.message);
    }
  }, config.logGenerator.intervalMs || 1000);

  process.on('SIGINT', () => clearInterval(timer));
  process.on('SIGTERM', () => clearInterval(timer));
}
