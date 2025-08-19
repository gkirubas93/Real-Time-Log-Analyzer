import React, { useEffect, useMemo, useRef } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Chip } from '@mui/material';
import { formatDate } from '../utils/formatDate.js';

function LevelPill({ level }) {
  const map = {
    INFO: { color: 'success', label: 'INFO' },
    WARN: { color: 'warning', label: 'WARN' },
    ERROR: { color: 'error', label: 'ERROR' },
  };
  const m = map[level] || { color: 'default', label: level };
  return <Chip size="small" color={m.color} label={m.label} variant="outlined" sx={{ fontWeight: 600 }} />;
}
function ServiceTag({ service }) { return <Chip size="small" label={service} variant="outlined" />; }
function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function highlight(text, query) {
  if (!query) return text;
  const q = query.trim(); if (!q) return text;
  const parts = String(text).split(new RegExp(`(${escapeRegExp(q)})`, 'gi'));
  return parts.map((p, i) => p.toLowerCase() === q.toLowerCase()
    ? <mark key={i} style={{ background: 'rgba(6,182,212,.25)', padding: '0 2px' }}>{p}</mark>
    : <span key={i}>{p}</span>);
}

export default function DataGridTable({
  rows, loading, pageInfo,
  onNext,               // load more (append)
  useUtc, activeQuery,
  setAtTop,            // report if user is at top (for polling pause)
  showFooter = true,   // keep custom footer optional
}) {
  const columns = useMemo(() => ([
    {
      field: 'timestamp', headerName: 'Timestamp', width: 260, sortable: true,
      valueGetter: p => p.row.timestamp,
      renderCell: (p) => (
        <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
          {formatDate(p.value, useUtc)}
        </span>
      )
    },
    {
      field: 'level', headerName: 'Level', width: 110, sortable: true,
      renderCell: (p) => <LevelPill level={p.row.level} />
    },
    {
      field: 'service', headerName: 'Service', width: 140, sortable: true,
      renderCell: (p) => <ServiceTag service={p.row.service} />
    },
    {
      field: 'message', headerName: 'Message', flex: 1, sortable: false,
      renderCell: (p) =>
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
            {highlight(p.row.message, activeQuery)}
          </span>
        </div>
    },
  ]), [useUtc, activeQuery]);

  // const mapped = (Array.isArray(rows) ? rows : []).map((r,i)=>({ id: r._id || r.id || `row-${i}`, ...r }));
  const mapped = (Array.isArray(rows) ? rows : []).map((r, i) => ({
    ...r,
    // Always supply a unique, string id for the grid
    id: String(r._id ?? r.id ?? `row-${i}`)
  }));

  const containerRef = useRef(null);
  const loadingMoreRef = useRef(false);

  // Smooth endless scroll using the grid's virtual scroller
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const scroller = root.querySelector('.MuiDataGrid-virtualScroller');
    if (!scroller) return;

    const THRESHOLD_PX = 200;

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scroller;
      // report "at top" so polling knows whether to refresh
      setAtTop?.(scrollTop <= 4);

      const nearBottom = scrollTop + clientHeight >= scrollHeight - THRESHOLD_PX;
      if (nearBottom && pageInfo?.nextCursor != null && !loading && !loadingMoreRef.current) {
        loadingMoreRef.current = true;
        Promise.resolve(onNext?.()).finally(() => {
          // small delay prevents thrash while grid re-virtualizes
          setTimeout(() => { loadingMoreRef.current = false; }, 250);
        });
      }
    };

    scroller.addEventListener('scroll', onScroll, { passive: true });
    // run once to set initial atTop
    onScroll();
    return () => scroller.removeEventListener('scroll', onScroll);
  }, [onNext, pageInfo?.nextCursor, loading, setAtTop]);

  return (
    <Box className="card" sx={{ p: 1.5 }}>
      <div style={{ height: 620, width: '100%' }} ref={containerRef}>
        <DataGrid
          rows={mapped}
          columns={columns}
          loading={loading}
          // getRowId={(row) => row.id}
          getRowId={(row) => String(row._id ?? row.id)}
          disableRowSelectionOnClick
          density="compact"
          hideFooter
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              position: 'sticky', top: 0, backdropFilter: 'blur(6px)',
              backgroundColor: '#fff', borderBottom: '1px solid rgba(15,23,42,0.08)',
            },
            '& .MuiDataGrid-iconSeparator': { display: 'none' },
            '& .MuiDataGrid-row:nth-of-type(odd)': { backgroundColor: '#fafafa' },
            '& .MuiDataGrid-footerContainer': { display: 'none' },
          }}
        />
      </div>

      {showFooter && (
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
          <div style={{ color: 'var(--muted)' }}>
            Showing {rows.length}{pageInfo.limit ? ` • Page size ${pageInfo.limit}` : ''}
          </div>
          <Button
            variant="contained"
            onClick={onNext}
            disabled={pageInfo?.nextCursor == null || loading}
          >
            {loading ? 'Loading…' : 'Load more'}
          </Button>
        </Box>
      )}
    </Box>
  );
}