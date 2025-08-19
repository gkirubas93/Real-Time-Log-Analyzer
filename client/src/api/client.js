import axios from 'axios';
const BASE = import.meta.env.VITE_API || 'http://localhost:5000';
const instance = axios.create({ baseURL: BASE, timeout: 10000 });

export async function fetchLogs({ level, service, from, to, q, limit, afterTs, afterId }) {
  const params = new URLSearchParams();
  if (level) params.set('level', level);
  if (service) params.set('service', service);
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  if (q != null) params.set('q', q);
  if (limit) params.set('limit', String(limit));
  if (afterTs) params.set('afterTs', afterTs);        // <<— IMPORTANT
  if (afterId) params.set('afterId', afterId);        // <<— IMPORTANT

  const url = `http://localhost:5000/logs?${params.toString()}`
  console.log(url)
  const res = await instance.get(`/logs?${params.toString()}`);

  return res.data;
}

export async function fetchStats(windowSec = 60) {
  const res = await instance.get(`/logs/stats`);
  return res.data;
}
