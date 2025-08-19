import React from 'react';
import clsx from 'clsx';

const levels = ['', 'INFO', 'WARN', 'ERROR'];
const services = ['', 'auth', 'payments', 'notifications'];

function Chip({ active, onClick, children }) {
  return (
    <button className={clsx('chip', active && 'chip--active')} onClick={onClick} type="button">
      {children}
    </button>
  );
}

export default function FiltersProfessional({ value, onChange, refreshMs, setRefreshMs }) {
  const set = (k, v) => onChange({ ...value, [k]: v });

  return (
    <div className="filters-pro">
      <div className="filters-row">
        <div className="filter-group">
          <label>Level</label>
          <div className="chips">
            {levels.map(l => (
              <Chip key={l} active={value.level === l} onClick={() => set('level', l)}>{l || 'All'}</Chip>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Service</label>
          <div className="chips">
            {services.map(s => (
              <Chip key={s} active={value.service === s} onClick={() => set('service', s)}>{s || 'All'}</Chip>
            ))}
          </div>
        </div>

        <div className="filter-search">
          <label>Search</label>
          <input placeholder="Search messages (free text)" value={value.q} onChange={e => set('q', e.target.value)} />
        </div>

        <div className="filter-controls">
          <label>Refresh (ms)</label>
          <input type="number" value={refreshMs} onChange={e => setRefreshMs(Number(e.target.value) || 5000)} />
          <button className="btn" onClick={() => onChange({ level: '', service: '', q: '' })}>Reset</button>
        </div>
      </div>
    </div>
  );
}
