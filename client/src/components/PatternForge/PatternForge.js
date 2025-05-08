import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, Grid, Button } from '@mui/material';
import ForceGraph from 'force-graph';
import { useData } from '../../contexts/DataContext';
import { detectPatterns } from '../../utils/mlEngine';

const PatternForge = () => {
  const { activeDataset } = useData();
  const graphContainerRef = useRef(null);
  const [graphData, setGraphData] = useState(null);

  const generatePatterns = async () => {
    const patterns = await detectPatterns(activeDataset.data);
    // Process patterns into graph format
    setGraphData(processPatternsToGraph(patterns));
  };

  useEffect(() => {
    if (graphContainerRef.current && graphData) {
      ForceGraph()(graphContainerRef.current)
        .graphData(graphData)
        .nodeLabel('name')
        .linkDirectionalArrowLength(6);
    }
  }, [graphData]);

  return (
    <Box sx={{ p: 3 }}>
      {/* Full JSX implementation from original question */}
    </Box>
  );
};