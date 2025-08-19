import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Stack,
  FormControlLabel,
  Switch,
} from '@mui/material';
import useDebounce from '../hooks/useDebounce.js';

const levels = ['', 'INFO', 'WARN', 'ERROR'];
const services = ['', 'auth', 'payments', 'notifications'];

export default function FiltersBar({ value, onChange, useUtc, setUseUtc }) {
  // Debounce only free-text search
  const debouncedQ = useDebounce(value.q, 300);

  React.useEffect(() => {
    if (debouncedQ !== value.q) onChange({ ...value, q: debouncedQ });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  const set = (k, v) => onChange({ ...value, [k]: v });

  return (
    <Box className="card" sx={{ p: 2 }}>
      <Stack
        direction="row"
        spacing={1.5}
        flexWrap="wrap"
        alignItems="center"
        justifyContent="flex-start"
      >
        <TextField
          select
          label="Level"
          value={value.level}
          onChange={e => set('level', e.target.value)}
          sx={{ minWidth: 140 }}
        >
          {levels.map(l => (
            <MenuItem key={l || 'all'} value={l}>
              {l || 'All'}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Service"
          value={value.service}
          onChange={e => set('service', e.target.value)}
          sx={{ minWidth: 160 }}
        >
          {services.map(s => (
            <MenuItem key={s || 'all'} value={s}>
              {s || 'All'}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Search (message)"
          value={value.q}
          onChange={e => set('q', e.target.value)}
          placeholder="e.g. timeout OR user session"
          sx={{ minWidth: 240, flexGrow: 1 }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={useUtc}
              onChange={e => setUseUtc(e.target.checked)}
            />
          }
          label="UTC"
          sx={{ ml: 1 }}
        />

        <Button
          variant="outlined"
          color="secondary"
          onClick={() => onChange({ level: '', service: '', q: '' })}
        >
          Reset
        </Button>
      </Stack>
    </Box>
  );
}