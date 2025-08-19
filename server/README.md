# Real-Time Log Analyzer – Backend

Production-minded **Node.js + Express + MongoDB** backend for the assignment.

## Features
- Log generator (1 log/sec) with levels INFO/WARN/ERROR and services auth/payments/notifications
- Stores logs in MongoDB with indexes for performance
- `GET /logs` with filters, cursor pagination, and text search
- `GET /logs/stats` with windowed counts and error rate
- Helmet, CORS, centralized error handling, and clean structure

## Project Structure
backend/src/... (models, routes, utils, middleware, server)

## Setup
1) Start MongoDB (Docker optional).
   - `docker compose up -d` (a docker-compose.yml is provided at project root)
2) Backend:
   ```
   cd backend
   npm install
   cp .env.example .env
   npm run dev
   ```
3) Server runs at http://localhost:5000

## Environment (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/realtime_logs
LOG_GENERATOR_ENABLED=true
LOG_GENERATOR_RATE_MS=1000
```

## API: /logs
Query: level (CSV), service (CSV), q (text), from/to (ISO), limit (<=200), cursor (base64), sort (desc|asc).
Response: `{ data: [...], page: { limit, nextCursor } }`

## API: /logs/stats
`GET /logs/stats` → `{ counts: {INFO,WARN,ERROR}, total, errorRatePct }`

## Performance
- Indexes on timestamp, level, service; compound {level, service, timestamp}.
- Text index on message for q searches.
- Cursor pagination (timestamp, _id).
- `.lean()` reads for speed.
