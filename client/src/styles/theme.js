import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f6f7fb',
      paper: '#ffffff',
    },
    primary: { main: '#2563eb' },    // buttons/accents (blue)
    secondary: { main: '#0ea5a4' },  // accents (teal)
    success: { main: '#16a34a' },    // INFO
    warning: { main: '#d97706' },    // WARN
    error:   { main: '#dc2626' },    // ERROR
    text: { primary: '#0f172a', secondary: '#475569' },
    divider: 'rgba(15, 23, 42, 0.08)',
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: [
      'Inter',
      'system-ui',
      'Segoe UI',
      'Roboto',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(15,23,42,0.06)',
          boxShadow: '0 6px 18px rgba(2,6,23,0.06)',
        },
      },
    },
    MuiButton: {
      defaultProps: { variant: 'contained' },
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
      },
    },
  },
});

export default theme;