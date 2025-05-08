import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from 'react-query';

import theme from './theme/theme';
import Dashboard from './components/Dashboard/Dashboard';
import DataConnector from './components/DataConnector/DataConnector';
import Navbar from './components/Navigation/Navbar';
import Sidebar from './components/Navigation/Sidebar';
import VoiceAssistant from './components/VoiceAssistant/VoiceAssistant';
import { DataProvider } from './contexts/DataContext';
import { AIInsightsProvider } from './contexts/AIInsightsContext';
import { NotificationProvider } from './contexts/NotificationContext';
import PatternForge from './components/PatternForge/PatternForge';
import TimeWarp from './components/TimeWarp/TimeWarp';
import DataLens from './components/DataLens/DataLens';
import LayerStudio from './components/LayerStudio/LayerStudio';

const queryClient = new QueryClient();

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  const currentTheme = useMemo(() => theme(darkMode ? 'dark' : 'light'), [darkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        <NotificationProvider>
          <DataProvider>
            <AIInsightsProvider>
              <Router>
                <div className="app-container">
                  <Navbar 
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
                    toggleDarkMode={() => setDarkMode(!darkMode)} 
                    darkMode={darkMode} 
                  />
                  <div className="content-wrapper">
                    <Sidebar open={sidebarOpen} />
                    <main className="main-content">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/pattern-forge" element={<PatternForge />} />
                        <Route path="/time-warp" element={<TimeWarp />} />
                        <Route path="/data-lens" element={<DataLens />} />
                        <Route path="/layer-studio" element={<LayerStudio />} />
                        <Route path="/connect" element={<DataConnector />} />
                      </Routes>
                    </main>
                  </div>
                  <VoiceAssistant />
                </div>
              </Router>
            </AIInsightsProvider>
          </DataProvider>
        </NotificationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;