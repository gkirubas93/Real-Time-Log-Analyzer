import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import { Server } from 'socket.io';

import { connectDB } from './config/db.js';
import { config } from './config/config.js';
import logsRouter from './routes/logs.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';
import { startLogGenerator } from './jobs/logGenerator.js';

async function main() {
  await connectDB();

  const app = express();
  app.use(helmet());
  app.use(cors({ origin: '*' })); // tighten for prod
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => res.json({ ok: true }));

  // REST routes
  app.use('/logs', logsRouter);

  // 404 + error handling
  app.use(notFound);
  app.use(errorHandler);

  // Create HTTP server + Socket.IO
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: '*' }, // align with your frontend origin
  });

  // optional: connection logs (handy for debugging)
  io.on('connection', (socket) => {
    console.log('[ws] client connected', socket.id);
    socket.on('disconnect', (reason) => {
      console.log('[ws] client disconnected', socket.id, reason);
    });
  });

  // Start generator with io so it can emit 'log:new'
  startLogGenerator(io);

  server.listen(config.port, () => {
    console.log(`[server] http://localhost:${config.port}`);
  });

  // graceful shutdown
  process.on('SIGINT', () => server.close(() => process.exit(0)));
  process.on('SIGTERM', () => server.close(() => process.exit(0)));
}

main().catch((err) => {
  console.error('[bootstrap] fatal', err);
  process.exit(1);
});