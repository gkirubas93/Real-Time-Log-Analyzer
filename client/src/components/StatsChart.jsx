import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function StatsChart({ counts, errorRatePct }) {
    const data = [{ name: 'INFO', value: counts.INFO || 0 }, { name: 'WARN', value: counts.WARN || 0 }, { name: 'ERROR', value: counts.ERROR || 0 }];

    return (
        <div className="stats-chart">
            <div className="header">
                <h3>Last 60s</h3>
                <div>Error Rate: {Number(errorRatePct).toFixed(2)}%</div>
            </div><ResponsiveContainer width="100%" height={200}>
                <BarChart data={data}><CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip /><Bar dataKey="value" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}