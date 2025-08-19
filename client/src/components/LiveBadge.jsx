import React from 'react';
import { Box, Typography } from '@mui/material';
export default function LiveBadge({ connected }){
  return <Box display="flex" alignItems="center" gap={1}>
    <span style={{ width:10, height:10, borderRadius:999, background: connected ? '#22c55e' : '#94a3b8', display:'inline-block' }} />
    <Typography variant="body2" sx={{ color: connected ? '#a7f3d0' : '#94a3b8' }}>{connected ? 'Live' : 'Disconnected'}</Typography>
  </Box>;
}