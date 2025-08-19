import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export default function StatsPanel({ counts, errorRatePct }) {
  const data = [
    { name: 'INFO', count: counts.INFO || 0 },
    { name: 'WARN', count: counts.WARN || 0 },
    { name: 'ERROR', count: counts.ERROR || 0 }
  ];

  return (
    <div className="stats-panel card">
      <div className="stats-header">
        <h3>Last Window</h3>
        <div className="error-rate">Error Rate: <strong>{Number(errorRatePct).toFixed(2)}%</strong></div>
      </div>
      <div style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
