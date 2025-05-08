export function generateCombinedVisualization(container, layers, width, height) {
    if (!layers || layers.length === 0) return;
  
    // Clear previous visualization
    container.selectAll("*").remove();
  
    // Setup SVG container
    const svg = container
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('style', 'max-width: 100%; height: auto;');
  
    // Sort layers by z-index
    const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);
  
    // Collect all possible fields across layers
    const allColumns = new Set();
    sortedLayers.forEach(layer => {
      if (layer.visible && layer.dataset.data && layer.dataset.data.length > 0) {
        Object.keys(layer.dataset.data[0]).forEach(col => allColumns.add(col));
      }
    });
  
    // Determine field types (updated logic)
    const fieldTypes = {
      time: new Set(),
      numeric: new Set(),
      categorical: new Set()
    };
  
    allColumns.forEach(col => {
      let isTime = false;
      let isNumeric = false;
      let isCategorical = false;
  
      sortedLayers.forEach(layer => {
        if (layer.visible && layer.dataset.data && layer.dataset.data.length > 0) {
          const dataPoint = layer.dataset.data[0];
          if (dataPoint.hasOwnProperty(col)) {
            const value = dataPoint[col];
            
            // Check for time type
            if (!isTime) {
              const dateValue = new Date(value);
              if (!isNaN(dateValue) || value instanceof Date) {
                fieldTypes.time.add(col);
                isTime = true;
              }
            }
            
            // Check for numeric type
            if (!isNumeric && typeof value === 'number') {
              fieldTypes.numeric.add(col);
              isNumeric = true;
            }
          }
        }
      });
  
      // Categorical if not time or numeric
      if (!isTime && !isNumeric) {
        fieldTypes.categorical.add(col);
      }
    });
  
    // Convert Sets to Arrays
    const timeFields = Array.from(fieldTypes.time);
    const numericFields = Array.from(fieldTypes.numeric);
    const categoricalFields = Array.from(fieldTypes.categorical);
  
    // Select primary axes
    let xField, yField;
    if (timeFields.length > 0) {
      xField = timeFields[0];
      yField = numericFields.length > 0 ? numericFields[0] : null;
    } else if (categoricalFields.length > 0) {
      xField = categoricalFields[0];
      yField = numericFields.length > 0 ? numericFields[0] : null;
    } else if (numericFields.length >= 2) {
      xField = numericFields[0];
      yField = numericFields[1];
    }
  
    // Filter layers to those containing both x and y fields
    const compatibleLayers = sortedLayers.filter(layer => {
      if (!layer.visible || !layer.dataset.data) return false;
      return layer.dataset.data.some(d => d.hasOwnProperty(xField) && d.hasOwnProperty(yField));
    });
  
    if (!xField || !yField || compatibleLayers.length === 0) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .text('Combine compatible layers using common dimensions');
      return;
    }
  
    // Collect data from compatible layers
    const allData = [];
    compatibleLayers.forEach(layer => {
      layer.dataset.data.forEach(d => {
        if (d[xField] !== undefined && d[yField] !== undefined) {
          allData.push({
            ...d,
            __layerId: layer.id,
            __color: layer.colorScheme
          });
        }
      });
    });
  
    // Create scales
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
  
    let xScale, yScale;
    
    // X scale configuration
    if (timeFields.includes(xField)) {
      xScale = d3.scaleTime()
        .domain(d3.extent(allData, d => new Date(d[xField])))
        .range([0, innerWidth])
        .nice();
    } else if (numericFields.includes(xField)) {
      xScale = d3.scaleLinear()
        .domain(d3.extent(allData, d => +d[xField]))
        .range([0, innerWidth])
        .nice();
    } else {
      xScale = d3.scaleBand()
        .domain([...new Set(allData.map(d => d[xField]))])
        .range([0, innerWidth])
        .padding(0.1);
    }
  
    // Y scale configuration
    yScale = d3.scaleLinear()
      .domain([0, d3.max(allData, d => +d[yField])])
      .range([innerHeight, 0])
      .nice();
  
    // Create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
  
    // Create chart container
    const chart = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
    // Draw axes
    chart.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');
  
    chart.append('g')
      .call(yAxis);
  
    // Draw visualization for each compatible layer
    compatibleLayers.forEach(layer => {
      const layerData = allData.filter(d => d.__layerId === layer.id);
      
      if (timeFields.includes(xField)) {
        // Line chart for time series
        const line = d3.line()
          .x(d => xScale(new Date(d[xField])))
          .y(d => yScale(d[yField]))
          .curve(d3.curveMonotoneX);
  
        chart.append('path')
          .datum(layerData)
          .attr('fill', 'none')
          .attr('stroke', layer.colorScheme)
          .attr('stroke-width', 2)
          .attr('opacity', layer.opacity)
          .attr('d', line);
      } else if (xScale.bandwidth) {
        // Bar chart for categorical data
        chart.selectAll(`.bar-${layer.id}`)
          .data(layerData)
          .enter().append('rect')
          .attr('class', `bar-${layer.id}`)
          .attr('x', d => xScale(d[xField]))
          .attr('y', d => yScale(d[yField]))
          .attr('width', xScale.bandwidth())
          .attr('height', d => innerHeight - yScale(d[yField]))
          .attr('fill', layer.colorScheme)
          .attr('opacity', layer.opacity);
      } else {
        // Scatter plot for numeric data
        chart.selectAll(`.dot-${layer.id}`)
          .data(layerData)
          .enter().append('circle')
          .attr('class', `dot-${layer.id}`)
          .attr('cx', d => xScale(d[xField]))
          .attr('cy', d => yScale(d[yField]))
          .attr('r', 4)
          .attr('fill', layer.colorScheme)
          .attr('opacity', layer.opacity);
      }
    });
  
    // Add axis labels
    chart.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .text(xField);
  
    chart.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -margin.left + 20)
      .attr('text-anchor', 'middle')
      .text(yField);
  }