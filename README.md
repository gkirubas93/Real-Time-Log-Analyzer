#📊 Real-Time Log Analyzer

A modern web application for visualizing logs in real-time. It supports WebSocket live streaming, REST API fallbacks, advanced filtering, and chart-based insights.

#🚀 Features

Live Updates via WebSocket – See new logs in real-time.

Polling Fallback – Automatically switches to periodic REST polling if WebSocket is unavailable.

Advanced Filters – Search by log level, service, or query string.

Stats Dashboard – View log counts and error rates with charts.

Infinite Scroll – Browse historical logs seamlessly with cursor-based pagination.

Timezone Support – Toggle between local time and UTC.

#🛠️ Tech Stack

Frontend: React, Material UI (MUI DataGrid, Charts)

Backend: Node.js, Express, MongoDB

Real-time: WebSocket for push updates

#📦 Setup
#1. Clone Repository
git clone https://github.com/gkirubas93/Real-Time-Log-Analyzer.git
cd log-analyzer

#2. Install Dependencies
# Backend
cd server
npm install

# Frontend
cd ../client
npm install

#3. Start Services
# Backend
cd server
npm run dev

# Frontend
cd ../client
npm start

#4. Environment Variables

Create a .env file in /server with:

MONGO_URI=mongodb://localhost:27017/logs
PORT=4000

#📖 Usage

Open http://localhost:3000 in browser

Use filters to narrow logs by level, service, or keywords

Scroll down to load older logs automatically

Stay at top to receive live WebSocket updates


#🔮 Future Enhancements

Here are some potential next steps that would make the tool even more powerful:

Authentication & Role-based Access

Allow restricted log access based on user roles (Admin, Developer, Viewer).

Multi-source Log Ingestion

Support logs from multiple applications, containers, or external APIs.

Advanced Filtering

Add regex-based search, service groups, and error-only views.

Alerting & Notifications

Trigger Slack/Email alerts on error spikes or threshold breaches.

Export & Sharing

Allow exporting logs (CSV, JSON) or generating sharable reports.

Archival & Retention

Automatically archive old logs to cold storage (S3, Glacier).

Dark Mode & Theming

Customizable UI themes for better accessibility.
