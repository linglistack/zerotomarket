import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './pages/Dashboard';
import MarketingCampaign from './pages/NewProduct';
import CompetitorInsights from './pages/CompetitorInsights';
import ContentLibrary from './pages/ContentLibrary';
import MainLayout from './layouts/MainLayout';
import './App.css';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF7E5F',
      light: '#FFF0EB',
      dark: '#E05A3B',
    },
    secondary: {
      main: '#4ECDC4',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products/new" element={<MarketingCampaign />} />
            <Route path="competitors" element={<CompetitorInsights />} />
            <Route path="content" element={<ContentLibrary />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
