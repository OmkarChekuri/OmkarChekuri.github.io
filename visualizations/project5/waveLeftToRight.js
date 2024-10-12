(function () {
  // Set up margins, dimensions
  const margin = { top: 40, right: 40, bottom: 40, left: 40 };
  const width = window.innerWidth - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // Append SVG container
  const chartArea = d3.select("#chart-area");
  //console.log("Chart Area Selection:", chartArea.empty());

  if (chartArea.empty()) {
    //console.error("Element with id #chart-area not found in DOM!");
    return; // Exit if the element is not found
  } else {
    //console.log("Element found! Proceeding to append SVG...");
  }

  const svg = chartArea
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  //console.log("SVG appended to DOM:", svg);

  // Initialize scales
  const xScale = d3.scaleTime().range([0, width]);
  const yScale = d3.scaleLinear().range([height, 0]); // Y-scale to mimic wave heights

  // Initialize color scale for different "waves" (stocks or streams)
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  // Streaming data setup
  const accumulatedData = {};

  // Create area generator for wave-like flow
  const areaGenerator = d3
    .area()
    .x((d) => xScale(new Date(d.timestamp))) // Use timestamp for x-axis
    .y0(height) // Baseline of the wave at the bottom of the chart
    .y1((d) => yScale(d.close)) // Wave's peak will vary with the data (close price)
    .curve(d3.curveNatural); // Use smooth curve for a natural wave effect

  // Initial x-scale domain (we'll adjust dynamically as data streams in)
  xScale.domain([new Date(), new Date()]);

  // Function to update the chart as new data streams in
  function updateWaves(newData) {
    //console.log("New data:", newData); // Log the new data

    // Process incoming data
    newData.forEach(({ symbol, data }) => {
      if (!accumulatedData[symbol]) {
        accumulatedData[symbol] = [];
      }
      accumulatedData[symbol] = [...accumulatedData[symbol], ...data].slice(
        -10
      ); // Keep the last 100 points
    });

    const flattenedData = Object.values(accumulatedData).flat();
    //console.log("Flattened data:", flattenedData);

    // Update xScale to account for the new timestamp range
    const minX = d3.min(flattenedData, (d) => new Date(d.timestamp));
    const maxX = d3.max(flattenedData, (d) => new Date(d.timestamp));
    //console.log("X Scale Domain:", [minX, maxX]);
    xScale.domain([minX, maxX]);

    // Update yScale dynamically based on data
    const maxY = d3.max(flattenedData, (d) => d.close) || 100; // Dynamic y-scale based on data
    yScale.domain([0, maxY]);
    //console.log("Y Scale Domain:", [0, maxY]);

    // For each stream (stock/wave) update the waves
    Object.entries(accumulatedData).forEach(([symbol, dataPoints]) => {
      //console.log("Data Points for", symbol, dataPoints);

      const wavePath = svg
        .selectAll(`.wave-${symbol}`)
        .data([dataPoints], (d) => d.timestamp); // Bind data to the path

      // Enter phase for new data (creating new wave if necessary)
      wavePath
        .enter()
        .append("path")
        .attr("class", `wave-${symbol}`)
        .attr("fill", colorScale(symbol))
        .attr("opacity", 0.6) // Slight opacity for wave-like effect
        .attr("d", areaGenerator) // Create the area
        .merge(wavePath) // Update existing waves
        .transition() // Smooth transition for wave movement
        .duration(800)
        .ease(d3.easeLinear)
        .attr("d", areaGenerator); // Redraw the area

      wavePath.exit().remove(); // Remove old waves
    });
  }

  // Simulate real-time data updates
  function simulateRealTimeData(updateFunction) {
    const generateRandomData = (symbol) => {
      const now = new Date();
      return {
        symbol: symbol,
        data: Array.from({ length: 1 }, () => ({
          timestamp: now,
          close: Math.random() * 100 + 50, // Simulate random close values
          open: Math.random() * 100,
          high: Math.random() * 100 + 100,
          low: Math.random() * 50,
        })),
      };
    };

    const symbols = ["WAVE1", "WAVE2", "WAVE3"];

    setInterval(() => {
      const newData = symbols.map((symbol) => generateRandomData(symbol));
      //console.log("New Data:", newData); // Log new data for each update
      updateFunction(newData); // Update the chart with new data
    }, 1000); // Update every second
  }

  // Start the wave simulation
  simulateRealTimeData(updateWaves);
})();
