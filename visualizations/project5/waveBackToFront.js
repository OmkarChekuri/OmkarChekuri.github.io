(function () {
  // Set up margins, dimensions
  const margin = { top: 40, right: 0, bottom: 40, left: 0 };
  const width = window.innerWidth; // Width of the plot
  const height = 300; // Height of the plot

  // Append SVG container
  const chartArea = d3.select("#chart-area");
  const svg = chartArea
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Initialize scales
  const xScale = d3.scaleLinear().range([0, width]); // X-axis scale
  const yScale = d3.scaleLinear().range([height, 0]); // Y-axis scale

  // Ocean-like color palette (single tones for waves)
  const oceanColors = [
    "#00509E", // Deep Blue
    "#0077BE", // Ocean Blue
    "#00B4D8", // Sky Blue
    "#90E0EF", // Light Blue
    "#CAF0F8", // Foam White
  ];

  // Function to get a random ocean color
  function getRandomOceanColor() {
    return oceanColors[Math.floor(Math.random() * oceanColors.length)];
  }

  // Generate random data for each wave
  function generateRandomData(numPoints) {
    return d3.range(numPoints).map((i) => ({
      x: i,
      y: Math.random() * 100,
    }));
  }

  // Generate initial random data for each wave
  function generateInitialRandomData(numPoints) {
    return d3.range(numPoints).map((i) => ({
      x: i,
      y: Math.random() * 100, // Initial random y-value between 0 and 100
    }));
  }

  // Generate new random data with slight variation based on previous data
  function generateNextRandomData(previousData) {
    const jitter = 5; // Maximum amount the y-value can change by
    return previousData.map((d) => ({
      x: d.x,
      y: Math.max(0, Math.min(100, d.y + (Math.random() - 0.5) * jitter)), // Small random adjustment
    }));
  }

  // Generate random bubbles starting from the bottom
  function generateRandomBubbles(numBubbles) {
    return d3.range(numBubbles).map(() => ({
      cx: Math.random() * width, // Random x-position across the width
      cy: height, // Start from the bottom of the SVG
      r: Math.random() * 5 + 2, // Random radius (size) of the bubble
      opacity: Math.random() * 0.5 + 0.3, // Random opacity for realism
    }));
  }

  // Area generator function
  const areaGenerator = d3
    .area()
    .x((d) => xScale(d.x)) // X position based on the data
    .y0(height) // Bottom of the area chart at the bottom of the SVG
    .y1((d) => yScale(d.y)) // Y position based on the data
    .curve(d3.curveMonotoneX); // Use monotone curve for smooth transitions

  // Set the domain for the scales
  xScale.domain([0, 20]); // X-axis from 0 to 20 data points
  yScale.domain([0, 100]); // Y-axis for random values between 0 and 100

  // Function to create and transition multiple waves with bubbles
  function createAndTransitionWave() {
    let currentData = [];
    // Initial wave data
    if (currentData.length === 0) {
      currentData = generateInitialRandomData(40); // Generate initial data if empty
    } else {
      currentData = generateNextRandomData(currentData); // Generate new data based on previous data
    }

    // Append a new wave path with an initial random color
    const wave = svg
      .append("path")
      .datum(currentData)
      .attr("fill", getRandomOceanColor()) // Start with a random ocean color
      .attr("opacity", 0.6) // Adjust opacity so waves blend visually
      .attr("d", areaGenerator);

    // Generate initial bubbles for the wave
    let bubbles = svg
      .selectAll(".bubble")
      .data(generateRandomBubbles(10))
      .enter()
      .append("circle")
      .attr("class", "bubble")
      .attr("cx", (d) => d.cx)
      .attr("cy", (d) => d.cy)
      .attr("r", (d) => d.r)
      .attr("fill", "#FFFFFF") // White for foam/bubbles
      .attr("opacity", (d) => d.opacity);

    // Function to continuously animate bubbles
    function animateBubbles() {
      bubbles
        .transition()
        .delay(() => Math.random() * 3000) // Introduce a random delay before the bubble starts moving
        .duration(3000) // Duration for the bubble to rise
        .ease(d3.easeLinear)
        .attr("cy", -10) // Move the bubbles upward beyond the top of the SVG
        .on("end", function () {
          // Reset the bubbles to a random starting y-position and restart animation
          d3.select(this)
            .attr("cy", Math.random() * height) // Randomize the starting position along the y-axis
            .attr("cx", Math.random() * width) // Randomize the x-position again
            .attr("r", Math.random() * 5 + 2) // Randomize the size again
            .attr("opacity", Math.random() * 0.5 + 0.3) // Randomize opacity again
            .transition()
            .delay(() => Math.random() * 3000) // Random delay before the next rise
            .duration(3000)
            .ease(d3.easeLinear)
            .attr("cy", -10) // Repeat the upward movement
            .on("end", animateBubbles); // Continue looping
        });
    }

    // Start bubble animation
    animateBubbles();

    // Function to transition to new random data for this wave
    function transitionToNewWave() {
      const newData = generateRandomData(50);

      // Transition this wave to the new data and random color
      wave
        .datum(newData)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("d", areaGenerator)
        .attr("fill", getRandomOceanColor()); // Change to a new random ocean color

      // Continuously transition without pause
      setTimeout(transitionToNewWave, 1000);
    }

    // Start the first wave transition
    transitionToNewWave();
  }

  // Superimpose multiple waves
  createAndTransitionWave(); // Wave 1
  createAndTransitionWave(); // Wave 2
})();
