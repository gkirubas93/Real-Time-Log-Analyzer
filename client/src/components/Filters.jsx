import React from 'react';

export default function Filters({ value, onChange, refreshMs, setRefreshMs }) {
    const set = (k, v) => onChange({ ...value, [k]: v });
    return (<div className="filters">
        <select value={value.level} onChange={e => set('level', e.target.value)}>
            <option value="">All Levels</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
        </select>
        <select value={value.service} onChange={e => set('service', e.target.value)}>
            <option value="">All Services</option>
            <option value="auth">auth</option>
            <option value="payments">payments</option>
            <option value="notifications">notifications</option>
        </select>
        <input placeholder="Search message..." value={value.q} onChange={e => set('q', e.target.value)} />
        <label>Refresh(ms):</label>
        <input type="number" value={refreshMs} onChange={e => setRefreshMs(Number(e.target.value) || 5000)} />
        <button onClick={() => onChange({ level: '', service: '', q: '' })}>Reset</button>
    </div>);
}