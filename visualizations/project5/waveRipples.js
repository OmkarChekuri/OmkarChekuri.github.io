(function () {
  // Set up margins and dimensions
  const margin = { top: 40, right: 40, bottom: 40, left: 40 };
  const width = 500;
  const height = 500;
  const centerX = width / 2; // Center X position
  const centerY = height / 2; // Center Y position

  // Append SVG container
  const svg = d3
    .select("#chart-area")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Array of ocean-like colors
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

  // Function to create a new ripple that transitions to an area
  function createRipple() {
    // Create a circle at the center
    const ripple = svg
      .append("circle")
      .attr("cx", centerX)
      .attr("cy", centerY)
      .attr("r", 1) // Start with a small radius
      .attr("stroke", "#0077BE") // Ocean blue color for ripple lines
      .attr("stroke-width", 2)
      .attr("fill", getRandomOceanColor()) // Fill with the same color
      .attr("fill-opacity", 0) // Start with no fill
      .attr("opacity", 1); // Full opacity for the stroke

    // Animate the ripple to expand outward, fill, and fade out
    ripple
      .transition()
      .duration(3000) // Duration of the ripple expanding
      .ease(d3.easeLinear)
      .attr("r", 50) // Expand the circle to 200 radius
      .attr("stroke-width", 0) // Gradually remove the stroke
      .attr("fill-opacity", 0.4) // Gradually increase the fill opacity
      .attr("opacity", 0) // Fade out the entire circle (stroke + fill)
      .on("end", function () {
        d3.select(this).remove(); // Remove the circle after the transition ends
      });
  }

  // Function to continuously create ripples
  function continuousRipples() {
    createRipple(); // Create a ripple
    setTimeout(continuousRipples, 600); // Create a new ripple every 800ms
  }

  // Start creating ripples continuously
  continuousRipples();
})();
