// Check if performance.memory is available
if (performance.memory) {
  // Extract memory metrics
  const memoryData = [
    {
      label: "Total Heap Size",
      value: performance.memory.totalJSHeapSize / (1024 * 1024),
    }, // Convert to MB
    {
      label: "Used Heap Size",
      value: performance.memory.usedJSHeapSize / (1024 * 1024),
    }, // Convert to MB
    {
      label: "Heap Size Limit",
      value: performance.memory.jsHeapSizeLimit / (1024 * 1024),
    }, // Convert to MB
  ];

  // Set up dimensions for the chart
  const svgWidth = 700,
    svgHeight = 400;
  const margin = { top: 40, right: 80, bottom: 40, left: 80 };
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  const svg = d3
    .select("#memory-chart")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  const chart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Set up the color scale
  const colorScale = d3
    .scaleOrdinal()
    .domain(memoryData.map((d) => d.label))
    .range(d3.schemeCategory10); // Use a predefined color scheme (e.g., schemeCategory10)

  // Set up the scales
  const xScale = d3
    .scaleBand()
    .domain(memoryData.map((d) => d.label))
    .range([0, width])
    .padding(0.4);

  // Logarithmic y-scale (handles non-linear small/large values)
  const yScale = d3
    .scaleLog()
    .domain([1, d3.max(memoryData, (d) => d.value)]) // Start from 1 to avoid log(0)
    .range([height, 0])
    .base(10);

  // Append the bars with different colors
  chart
    .selectAll(".bar")
    .data(memoryData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d.label))
    .attr("y", (d) => yScale(d.value))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => height - yScale(d.value))
    .attr("fill", (d) => colorScale(d.label)); // Assign colors to the bars

  // Add labels on top of the bars
  chart
    .selectAll(".bar-label")
    .data(memoryData)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("x", (d) => xScale(d.label) + xScale.bandwidth() / 2)
    .attr("y", (d) => yScale(d.value) - 5)
    .attr("text-anchor", "middle")
    .text((d) => `${Math.round(d.value)} MB`);

  // Add the x-axis
  chart
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  // Add the y-axis with log scale
  chart.append("g").call(d3.axisLeft(yScale).ticks(5, "~s")); // "~s" format for more readable labels

  // Add the y-axis label
  svg
    .append("text")
    .attr("x", -(height / 2) - margin.top)
    .attr("y", margin.left / 2.5)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("Memory (MB)");

  // Add chart title
  svg
    .append("text")
    .attr("x", width / 2 + margin.left)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .text("JavaScript Memory Usage (Logarithmic Scale, MB)");

  // Add a legend
  const legend = svg
    .append("g")
    .attr("transform", `translate(${width + margin.right / 2}, ${margin.top})`);

  // Add legend rectangles and labels
  memoryData.forEach((d, i) => {
    const legendRow = legend
      .append("g")
      .attr("transform", `translate(0, ${i * 20})`);

    // Append colored rectangles for legend
    legendRow
      .append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", colorScale(d.label));

    // Append text labels for legend
    legendRow
      .append("text")
      .attr("x", 20)
      .attr("y", 12)
      .attr("text-anchor", "start")
      .style("font-size", "12px")
      .text(d.label);
  });
} else {
  console.log("Memory information is not available in this browser.");
}
