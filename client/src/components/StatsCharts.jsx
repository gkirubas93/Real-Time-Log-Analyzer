import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function StatsCharts({ counts, errorRatePct }){
  const data = [
    { name: 'INFO', count: counts.INFO || 0 },
    { name: 'WARN', count: counts.WARN || 0 },
    { name: 'ERROR', count: counts.ERROR || 0 }
  ];
  return (
    <Card className="card">
      <CardContent>
        <Typography variant="subtitle1">Stats</Typography>
        <div style={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>Error Rate: {Number(errorRatePct).toFixed(2)}%</Typography>
      </CardContent>
    </Card>
  );
}