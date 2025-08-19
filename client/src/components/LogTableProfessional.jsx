import React, { memo } from 'react';
const LogRow = memo(({ l }) => (
  <tr>
    <td className="ts">{new Date(l.timestamp).toLocaleString()}</td>
    <td className="level">{l.level}</td>
    <td className="service">{l.service}</td>
    <td className="message">{l.message}</td>
  </tr>
));

export default function LogTableProfessional({ logs, loading, onNext, onPrev, page }) {
  return (
    <div className="log-panel card">
      <div className="table-wrap">
        <table className="log-table" role="table" aria-label="logs table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Level</th>
              <th>Service</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4">Loading...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan="4">No logs</td></tr>
            ) : (
              logs.map(l => <LogRow key={l._id} l={l} />)
            )}
          </tbody>
        </table>
      </div>
      <div className="pager">
        <button onClick={onPrev} disabled={!page.prevCursor} className="btn">Prev</button>
        <div className="page-info">Showing {logs.length} • Limit {page.limit}</div>
        <button onClick={onNext} disabled={!page.nextCursor} className="btn">Next</button>
      </div>
    </div>
  );
}
