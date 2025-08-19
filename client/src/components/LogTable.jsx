import React from 'react';

const LogRow = React.memo(({ log }) => (
  <tr>
    <td>{log.timestamp}</td>
    <td>{log.level}</td>
    <td>{log.service}</td>
    <td>{log.message}</td>
  </tr>
));

export default function LogTable({ logs }) {
  return (
    <table role="table" aria-label="Logs table">
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Level</th>
          <th>Service</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => <LogRow key={log.id} log={log} />)}
      </tbody>
    </table>
  );
}
