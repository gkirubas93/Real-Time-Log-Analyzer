import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './styles/theme.js'

createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);