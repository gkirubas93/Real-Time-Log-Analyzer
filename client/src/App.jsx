import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Container, Box, Paper, Typography } from '@mui/material';
import FiltersBar from './components/FiltersBar.jsx';
import DataGridTable from './components/DataGridTable.jsx';
import StatsCharts from './components/StatsCharts.jsx';
import LiveBadge from './components/LiveBadge.jsx';
import { fetchLogs, fetchStats } from './api/client.js';
import useSocket from './hooks/useSocket.js';

const REFRESH_MS = 5000;

export default function App() {
  const [filters, setFilters] = useState({ level: '', service: '', q: '' });
  const [rows, setRows] = useState([]);
  const [pageInfo, setPageInfo] = useState({ limit: 100, nextCursor: null });
  const nextCursorRef = useRef(null);          // <-- always latest cursor
  const appendingRef = useRef(false);         // <-- prevents double-append

  const [stats, setStats] = useState({ counts: { INFO: 0, WARN: 0, ERROR: 0 }, errorRate: 0 });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);   // <-- global error banner text

  const [useUtc, setUseUtc] = useState(false);
  const [atTop, setAtTop] = useState(true);


  const loadStats = useCallback(async () => {
    try {
      const s = await fetchStats(60);
      setStats(s);
      // don't clobber existing page error if logs failed; only clear if we succeed at least one call
      setErrorMsg(null);
    } catch (e) {
      setErrorMsg(`Failed to fetch stats: ${e?.message ?? e}`);
    }
  }, []);

  // keep nextCursorRef in sync with state
  useEffect(() => { nextCursorRef.current = pageInfo.nextCursor; }, [pageInfo.nextCursor]);

  // Core loader: pass cursor EXPLICITLY (don’t read from state inside)
  const loadLogs = useCallback(
    async ({ mode = 'replace', cursor = null } = {}) => {
      if (mode === 'append') {
        if (appendingRef.current) return;      // throttle
        appendingRef.current = true;
      }
      setLoading(true);
      try {
        const res = await fetchLogs({
          ...filters,
          limit: pageInfo.limit,
          afterTs: cursor?.afterTs ?? undefined,
          afterId: cursor?.afterId ?? undefined,
        });

        const rowsArray =
          Array.isArray(res) ? res
            : Array.isArray(res?.data) ? res.data
              : Array.isArray(res?.items) ? res.items
                : [];

        // backend returns { nextCursor: { afterTs, afterId } | null }
        const nextCursor = res?.nextCursor ?? null;

        console.log('[logs] fetched:', rowsArray.length,
          'first:', rowsArray[0]?._id, 'last:', rowsArray[rowsArray.length - 1]?._id,
          'nextCursor:', nextCursor);

        setErrorMsg(null);
        setRows(prev => {
          const before = prev.length;
          if (mode === 'append') {
            console.log('[logs] append before:', before);
            const map = new Map();
            for (const r of prev) {
              map.set(String(r._id ?? r.id), r);
            }
            for (const r of rowsArray) {
              map.set(String(r._id ?? r.id), r);
            }
            const out = Array.from(map.values());
            console.log('[logs] append after:', out.length, 'added approx:', out.length - before);
            return out;
          }
          console.log('[logs] replace count:', rowsArray.length);
          return rowsArray;
        });

        // update both state and ref
        setPageInfo(p => ({ ...p, nextCursor }));
        nextCursorRef.current = nextCursor;
        console.log('[logs] pageInfo.nextCursor ->', nextCursor);
      } catch (e) {
        // Show friendly message; keep previous rows on screen
        setErrorMsg(`Failed to fetch logs: ${e?.message ?? e}`);
      } finally {
        setLoading(false);
        if (mode === 'append') {
          // small delay to let virtualization settle
          setTimeout(() => { appendingRef.current = false; }, 200);
        }
      }
    },
    [filters, pageInfo.limit]
  );

  // Live (prepend only when at top)
  const onNewLog = useCallback((log) => {
    const okLevel = !filters.level || filters.level.split(',').includes(log.level);
    const okSvc = !filters.service || filters.service.split(',').includes(log.service);
    const okQ = !filters.q || (log.message || '').toLowerCase().includes(filters.q.toLowerCase());

    if (atTop && okLevel && okSvc && okQ) {
      setRows(prev => {
        const merged = [log, ...prev];
        const seen = new Set();
        const out = [];
        for (const r of merged) {
          const id = String(r._id || r.id);
          if (!seen.has(id)) { seen.add(id); out.push(r); }
          if (out.length >= pageInfo.limit * 3) break; // cap memory
        }
        return out;
      });
    }
    loadStats();
  }, [filters.level, filters.service, filters.q, atTop, pageInfo.limit, loadStats]);

  const { connected: wsConnected } = useSocket(onNewLog);

  // Initial load & on filter change
  useEffect(() => {
    setPageInfo(p => ({ ...p, nextCursor: null }));
    nextCursorRef.current = null;
    loadLogs({ mode: 'replace', cursor: null });
    loadStats();
  }, [filters.level, filters.service, filters.q, loadLogs, loadStats]);

  // Polling fallback only when at top & no WS
  useEffect(() => {
    const id = setInterval(() => {
      if (!atTop) return;
      if (wsConnected) return;
      loadLogs({ mode: 'replace', cursor: null });
      loadStats();
    }, REFRESH_MS);
    return () => clearInterval(id);
  }, [wsConnected, atTop, loadLogs, loadStats]);

  // This is the function DataGridTable calls when near bottom
  const handleLoadMore = useCallback(() => {
    const c = nextCursorRef.current;           // <-- current, not stale
    if (c == null) return;
    loadLogs({ mode: 'append', cursor: c });   // <-- pass cursor explicitly
  }, [loadLogs]);

  return (
    <Container maxWidth="xl" sx={{ pt: 2 }}>
      <Paper elevation={2} sx={{ p: 1.5, mb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Real-Time Log Visualizer</Typography>
        <Box display="flex" gap={2} alignItems="center">
          <LiveBadge connected={wsConnected} />
          <Typography variant="body2" color="text.secondary">
            {wsConnected ? 'Live over WS' : `Polling ${REFRESH_MS / 1000}s`}
          </Typography>
        </Box>
      </Paper>

      {errorMsg && (
        <Box sx={{ mb: 1.5 }}>
          <Paper elevation={1} sx={{ p: 1.5, borderLeft: '4px solid #ef5350', background: '#fff1f1' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
              <Typography variant="body2" color="error">
                {errorMsg}
              </Typography>
              <Box display="flex" gap={1}>
                <button
                  onClick={() => loadLogs({ mode: 'replace', cursor: null })}
                  disabled={loading}
                  style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ef5350', background: 'white', cursor: 'pointer' }}
                >
                  Retry
                </button>
              </Box>
            </Box>
          </Paper>
        </Box>
      )}

      <Box display="flex" gap={2}>
        <Box width={340}>
          <StatsCharts counts={stats.counts} errorRatePct={stats.errorRate} />
        </Box>

        <Box flex={1} display="flex" flexDirection="column" gap={2}>
          <FiltersBar
            value={filters}
            onChange={setFilters}
            useUtc={useUtc}
            setUseUtc={setUseUtc}
          />

          <DataGridTable
            rows={rows}
            loading={loading}
            useUtc={useUtc}
            activeQuery={filters.q}
            pageInfo={pageInfo}
            onNext={handleLoadMore}   // <-- now uses ref-backed cursor
            setAtTop={setAtTop}
            showFooter={false}
          />
        </Box>
      </Box>
    </Container>
  );
}