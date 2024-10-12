// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Setting up margins and dimensions
const margin = {
  top: 40,
  right: 150,
  bottom: 90,
  left: 60,
};
const width = 900 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Append SVG container
const svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Initialize scales and groups
const xScale = d3.scaleTime().range([0, width]);
const yScale = d3.scaleLinear().range([height, 0]);
const xAxisGroup = svg
  .append("g")
  .attr("transform", `translate(0, ${height})`)
  .attr("class", "axis");
const yAxisGroup = svg.append("g").attr("class", "axis");

// Tooltip setup with debounced mouseover function
const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

const debouncedMouseOver = debounce((event, d, symbol) => {
  tooltip.transition().duration(200).style("opacity", 0.9);
  tooltip
    .html(
      `<strong>Symbol:</strong> ${symbol}<br>` +
        `<strong>Open:</strong> ${d.open}<br>` +
        `<strong>Close:</strong> ${d.close}<br>` +
        `<strong>High:</strong> ${d.high}<br>` +
        `<strong>Low:</strong> ${d.low}<br>`
    )
    .style("left", `${event.pageX + 10}px`)
    .style("top", `${event.pageY - 28}px`);
}, 100); // Debounce set to 100ms

// Store data for each stock and limit to the most recent 100 data points
const accumulatedData = {};
const maxDataPoints = 15;

// Color scale for multiple stocks
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Add grid lines
svg
  .append("g")
  .attr("class", "grid horizontal-grid")
  .call(d3.axisLeft(yScale).ticks(10).tickSize(-width).tickFormat(""));
svg
  .append("g")
  .attr("class", "grid vertical-grid")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(xScale).ticks(10).tickSize(-height).tickFormat(""));

svg
  .append("text")
  .attr("class", "x-axis-label")
  .attr("text-anchor", "middle")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom - 20)
  .text("Time")
  .style("fill", "#151414")
  .style("font-size", "14px")
  .style("font-weight", "bold");

svg
  .append("text")
  .attr("class", "y-axis-label")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .attr("x", -height / 2)
  .attr("y", -50)
  .text("Stock Price")
  .style("fill", "#151414")
  .style("font-size", "14px")
  .style("font-weight", "bold");

// Function to update the chart when new data comes in
/* function updateChart(newData) {
  newData.forEach(({ symbol, data }) => {
    if (!accumulatedData[symbol]) {
      accumulatedData[symbol] = [];
    }
    // Keep only the last 100 data points
    accumulatedData[symbol] = [...accumulatedData[symbol], ...data].slice(
      -maxDataPoints
    );
  });

  const flattenedData = Object.values(accumulatedData).flat();

  // Update scales and axes
  xScale.domain(d3.extent(flattenedData, (d) => new Date(d.timestamp)));
  yScale.domain([0, 100]); // Adjust this for actual dynamic scaling if needed

  xAxisGroup
    .transition()
    .duration(800)
    .call(
      d3
        .axisBottom(xScale)
        .ticks(5)
        .tickFormat(d3.timeFormat("%H:%M:%S"))
        .tickSize(0)
        .tickPadding(10)
    );

  yAxisGroup
    .transition()
    .duration(800)
    .call(d3.axisLeft(yScale).ticks(5).tickSize(0).tickPadding(10));

  // Draw lines
  Object.entries(accumulatedData).forEach(([symbol, dataPoints]) => {
    const lineGenerator = d3
      .line()
      .x((d) => xScale(new Date(d.timestamp)))
      .y((d) => yScale(d.close))
      .curve(d3.curveMonotoneX);

    const linePath = svg.selectAll(`.line-${symbol}`).data([dataPoints]);

    linePath
      .enter()
      .append("path")
      .attr("class", `line-${symbol}`)
      .attr("fill", "none")
      .attr("stroke", colorScale(symbol))
      .attr("stroke-width", 1.5)
      .merge(linePath)
      .transition()
      .duration(800)
      .attr("d", lineGenerator);

    linePath.exit().remove();
  });

  // Draw candlesticks
  Object.entries(accumulatedData).forEach(([symbol, dataPoints]) => {
    const candlestickSelection = svg
      .selectAll(`.candlestick-${symbol}`)
      .data(dataPoints, (d) => d.timestamp);

    const enterCandlesticks = candlestickSelection
      .enter()
      .append("g")
      .attr("class", `candlestick-${symbol}`)
      .style("opacity", 0)
      .on("mouseover", (event, d) => debouncedMouseOver(event, d, symbol))
      .on("mouseout", () =>
        tooltip.transition().duration(500).style("opacity", 0)
      );

    enterCandlesticks
      .append("line")
      .attr("class", "wick")
      .attr("x1", (d) => xScale(new Date(d.timestamp)))
      .attr("x2", (d) => xScale(new Date(d.timestamp)))
      .attr("y1", (d) => yScale(d.high))
      .attr("y2", (d) => yScale(d.low))
      .attr("stroke", (d) => (d.close > d.open ? "#4caf50" : "#f44336"))
      .attr("stroke-width", 1);

    enterCandlesticks
      .append("rect")
      .attr("class", `candlestick-body`)
      .attr("x", (d) => xScale(new Date(d.timestamp)) - 4)
      .attr("y", (d) => yScale(Math.max(d.open, d.close)))
      .attr("width", 8)
      .attr("height", (d) => Math.abs(yScale(d.open) - yScale(d.close)))
      .attr("fill", (d) => (d.close > d.open ? "#4caf50" : "#f44336"));

    candlestickSelection
      .select("line.wick")
      .transition()
      .duration(800)
      .attr("x1", (d) => xScale(new Date(d.timestamp)))
      .attr("x2", (d) => xScale(new Date(d.timestamp)))
      .attr("y1", (d) => yScale(d.high))
      .attr("y2", (d) => yScale(d.low));

    candlestickSelection
      .select("rect.candlestick-body")
      .transition()
      .duration(800)
      .attr("x", (d) => xScale(new Date(d.timestamp)) - 4)
      .attr("y", (d) => yScale(Math.max(d.open, d.close)))
      .attr("height", (d) => Math.abs(yScale(d.open) - yScale(d.close)));

    enterCandlesticks.transition().duration(800).style("opacity", 1);

    candlestickSelection.exit().remove();
  });

  // Update legend
  svg.selectAll(".legend-group").remove();
  const legendGroup = svg.append("g").attr("class", "legend-group");

  Object.entries(accumulatedData).forEach(([symbol, dataPoints], index) => {
    const color = colorScale(symbol);
    const values = dataPoints.map((d) => d.close);
    const low = Math.min(...values).toFixed(2);
    const high = Math.max(...values).toFixed(2);
    const average = (
      values.reduce((sum, val) => sum + val, 0) / values.length
    ).toFixed(2);

    legendGroup
      .append("g")
      .attr("transform", `translate(${width + 20}, ${index * 70})`)
      .each(function () {
        d3.select(this)
          .append("rect")
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", color);

        d3.select(this)
          .append("text")
          .attr("x", 20)
          .attr("y", 12)
          .html(
            `<tspan style="font-weight:bold">${symbol}</tspan>` +
              `<tspan x="20" dy="15">Low: ${low}</tspan>` +
              `<tspan x="20" dy="15">High: ${high}</tspan>` +
              `<tspan x="20" dy="15">Avg: ${average}</tspan>`
          );
      });
  });
} */

function preloadHistoricalData() {
  const stocks = ["KNGX", "PNNL", "MNPL"]; // Example stock symbols
  const startTime = new Date(); // Current time
  const secondsInterval = 1000; // Interval of 1 second between data points

  stocks.forEach((symbol) => {
    let previousClose = Math.random() * 100; // Starting close price for each stock
    accumulatedData[symbol] = [];

    // Generate 15 historical data points
    for (let i = 0; i < 15; i++) {
      const timestamp = new Date(startTime.getTime() - i * secondsInterval);
      const { open, high, low, close } = generateOHLCData(previousClose, 0.02); // Generate OHLC data
      accumulatedData[symbol].unshift({
        timestamp: timestamp.toISOString(), // Store timestamp as ISO string
        open,
        high,
        low,
        close,
      });
      previousClose = close; // Update previousClose for the next iteration
    }
  });
}

// Function to update the chart when new data comes in
function updateChart(newData) {
  newData.forEach(({ symbol, data }) => {
    if (!accumulatedData[symbol]) {
      accumulatedData[symbol] = [];
    }
    // Keep only the last 100 data points
    accumulatedData[symbol] = [...accumulatedData[symbol], ...data].slice(
      -maxDataPoints
    );
  });

  const flattenedData = Object.values(accumulatedData).flat();

  // Update scales and axes
  const minX = d3.min(flattenedData, (d) => new Date(d.timestamp));
  const maxX = d3.max(flattenedData, (d) => new Date(d.timestamp));

  // Update the xScale dynamically to smoothly shift points left
  xScale.domain([minX, maxX]);

  // Update scales and axes
  xScale.domain(d3.extent(flattenedData, (d) => new Date(d.timestamp)));
  yScale.domain([0, 100]); // Adjust this for actual dynamic scaling if needed

  xAxisGroup
    .transition()
    .duration(800)
    .call(
      d3
        .axisBottom(xScale)
        .ticks(5)
        .tickFormat(d3.timeFormat("%H:%M:%S"))
        .tickSize(0)
        .tickPadding(10)
    );

  yAxisGroup
    .transition()
    .duration(800)
    .call(d3.axisLeft(yScale).ticks(5).tickSize(0).tickPadding(10));

  // Draw lines
  Object.entries(accumulatedData).forEach(([symbol, dataPoints]) => {
    const lineGenerator = d3
      .line()
      .x((d) => xScale(new Date(d.timestamp)))
      .y((d) => yScale(d.close))
      .curve(d3.curveBasis);

    const linePath = svg.selectAll(`.line-${symbol}`).data([dataPoints]);

    linePath
      .enter()
      .append("path")
      .attr("class", `line-${symbol}`)
      .attr("fill", "none")
      .attr("stroke", colorScale(symbol))
      .attr("stroke-width", 1.5)
      .merge(linePath)
      .transition()
      .duration(800)
      .attr("d", lineGenerator);

    linePath.exit().remove();
  });

  // Draw bands around candlesticks (between high and low)
  Object.entries(accumulatedData).forEach(([symbol, dataPoints]) => {
    const areaGenerator = d3
      .area()
      .x((d) => xScale(new Date(d.timestamp)))
      .y0((d) => yScale(d.low)) // Start of the band (low)
      .y1((d) => yScale(d.high)) // End of the band (high)
      .curve(d3.curveMonotoneX);

    const bandPath = svg.selectAll(`.band-${symbol}`).data([dataPoints]);

    bandPath
      .enter()
      .append("path")
      .attr("class", `band-${symbol}`)
      .attr("fill", colorScale(symbol))
      .attr("opacity", 0.1) // Set band opacity for a subtle effect
      .merge(bandPath)
      .transition()
      .duration(800)
      .attr("d", areaGenerator);

    bandPath.exit().remove();
  });

  // Draw candlesticks
  Object.entries(accumulatedData).forEach(([symbol, dataPoints]) => {
    const candlestickSelection = svg
      .selectAll(`.candlestick-${symbol}`)
      .data(dataPoints, (d) => d.timestamp);

    const enterCandlesticks = candlestickSelection
      .enter()
      .append("g")
      .attr("class", `candlestick-${symbol}`)
      .style("opacity", 0)
      .on("mouseover", (event, d) => debouncedMouseOver(event, d, symbol))
      .on("mouseout", () =>
        tooltip.transition().duration(500).style("opacity", 0)
      );

    enterCandlesticks
      .append("line")
      .attr("class", "wick")
      .attr("x1", (d) => xScale(new Date(d.timestamp)))
      .attr("x2", (d) => xScale(new Date(d.timestamp)))
      .attr("y1", (d) => yScale(d.high))
      .attr("y2", (d) => yScale(d.low))
      .attr("stroke", (d) => (d.close > d.open ? "#4caf50" : "#f44336"))
      .attr("stroke-width", 1);

    enterCandlesticks
      .append("rect")
      .attr("class", `candlestick-body`)
      .attr("x", (d) => xScale(new Date(d.timestamp)) - 4)
      .attr("y", (d) => yScale(Math.max(d.open, d.close)))
      .attr("width", 8)
      .attr("height", (d) => Math.abs(yScale(d.open) - yScale(d.close)))
      .attr("fill", (d) => (d.close > d.open ? "#4caf50" : "#f44336"));

    candlestickSelection
      .select("line.wick")
      .transition()
      .duration(800)
      .attr("x1", (d) => xScale(new Date(d.timestamp)))
      .attr("x2", (d) => xScale(new Date(d.timestamp)))
      .attr("y1", (d) => yScale(d.high))
      .attr("y2", (d) => yScale(d.low));

    candlestickSelection
      .select("rect.candlestick-body")
      .transition()
      .duration(800)
      .attr("x", (d) => xScale(new Date(d.timestamp)) - 4)
      .attr("y", (d) => yScale(Math.max(d.open, d.close)))
      .attr("height", (d) => Math.abs(yScale(d.open) - yScale(d.close)));

    enterCandlesticks.transition().duration(800).style("opacity", 1);

    candlestickSelection.exit().remove();
  });

  // Update legend
  svg.selectAll(".legend-group").remove();
  const legendGroup = svg.append("g").attr("class", "legend-group");

  Object.entries(accumulatedData).forEach(([symbol, dataPoints], index) => {
    const color = colorScale(symbol);
    const values = dataPoints.map((d) => d.close);
    const low = Math.min(...values).toFixed(2);
    const high = Math.max(...values).toFixed(2);
    const average = (
      values.reduce((sum, val) => sum + val, 0) / values.length
    ).toFixed(2);

    legendGroup
      .append("g")
      .attr("transform", `translate(${width + 20}, ${index * 70})`)
      .each(function () {
        d3.select(this)
          .append("rect")
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", color);

        d3.select(this)
          .append("text")
          .attr("x", 20)
          .attr("y", 12)
          .html(
            `<tspan style="font-weight:bold">${symbol}</tspan>` +
              `<tspan x="20" dy="15">Low: ${low}</tspan>` +
              `<tspan x="20" dy="15">High: ${high}</tspan>` +
              `<tspan x="20" dy="15">Avg: ${average}</tspan>`
          );
      });
  });
}

// Listen to real-time updates
simulateRealTimeUpdates(updateChart);
