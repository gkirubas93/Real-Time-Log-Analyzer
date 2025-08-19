import React from 'react';
import LogTable from '../components/LogTable.jsx';
import useLogs from '../hooks/useLogs.js';

export default function App() {
  const { logs, fetchMore, hasMore } = useLogs();

  return (
    <div role="main" aria-label="Logs dashboard">
      <h1>Realtime Logs Dashboard</h1>
      <LogTable logs={logs} />
      {hasMore && <button onClick={fetchMore}>Load more</button>}
    </div>
  );
}
