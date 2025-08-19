// src/hooks/useSocket.js
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

/**
 * Creates a single socket connection (once), and keeps the
 * onMessage handler in a ref so changes don't tear down the socket.
 */
export default function useSocket(onMessage) {
  const socketRef = useRef(null);
  const handlerRef = useRef(onMessage);
  const [connected, setConnected] = useState(false);

  // Keep handler ref up to date without changing effect deps
  useEffect(() => {
    handlerRef.current = onMessage;
  }, [onMessage]);

  // Create socket once
  useEffect(() => {
    const BASE = import.meta.env.VITE_API || 'http://localhost:5000';
    const s = io(BASE, {
      // allow polling fallback in case upgrade fails
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 500,
      timeout: 5000, // handshake timeout
      path: '/socket.io', // default; keep explicit if you use proxies
    });
    socketRef.current = s;

    s.on('connect', () => setConnected(true));
    s.on('disconnect', () => setConnected(false));
    s.on('connect_error', () => setConnected(false));

    s.on('log:new', (msg) => {
      if (handlerRef.current) handlerRef.current(msg);
    });

    return () => {
      try { s.close(); } catch {}
    };
    // IMPORTANT: empty deps -> make socket exactly once
  }, []);

  return { socket: socketRef.current, connected };
}