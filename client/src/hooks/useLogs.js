import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import api from '../lib/api.js';

export default function useLogs() {
  const [logs, setLogs] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const socketRef = useRef(null);

  useEffect(() => {
    async function fetchInitial() {
      const res = await api.get('/logs');
      console.log(res)
      setLogs(res.data.data);
      setCursor(res.data.nextCursor);
      setHasMore(!!res.data.nextCursor);
    }
    fetchInitial();
  }, []);

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
    socketRef.current.on('log', (log) => {
      setLogs((prev) => [log, ...prev]);
    });
    return () => socketRef.current.disconnect();
  }, []);

  async function fetchMore() {
    if (!cursor) return;
    const res = await api.get(`/logs?cursor=${cursor}`);
    setLogs((prev) => [...prev, ...res.data.data]);
    setCursor(res.data.nextCursor);
    setHasMore(!!res.data.nextCursor);
  }

  return { logs, fetchMore, hasMore };
}
