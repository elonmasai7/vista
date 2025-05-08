import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Button, Chip } from '@mui/material';
import { useData } from '../../contexts/DataContext';
import { useAIInsights } from '../../contexts/AIInsightsContext';
import ChartContainer from '../Visualizations/ChartContainer';
import InsightPanel from '../AI/InsightPanel';
import DataSummary from '../DataSummary/DataSummary';
import VisualizationRecommender from '../AI/VisualizationRecommender';

const Dashboard = () => {
  const { activeDataset, loadDataset } = useData();
  const { insights, generateInsights } = useAIInsights();
  const [widgets, setWidgets] = useState([]);
  const [layout, setLayout] = useState('grid');

  useEffect(() => {
    if (activeDataset) generateInsights(activeDataset.data);
  }, [activeDataset]);

  const addWidget = (type) => {
    setWidgets([...widgets, { 
      id: Date.now(), 
      type,
      config: {},
      data: activeDataset
    }]);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Dashboard UI from previous implementation */}
    </Box>
  );
};

export default Dashboard;