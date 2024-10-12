// Set up the dimensions and margins of the chart
const margin = { top: 100, right: 30, bottom: 60, left: 60 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;
const minPopulation = 10; // Minimum value for the log scale (log scale cannot have 0)

// Append SVG container for the bar chart
const svg = d3
  .select("#chart-area1")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Tooltip for displaying information
const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// Load the data from the external JSON file
d3.json("animalData.json").then(function (data) {
  const countries = data.countries; // Array of countries
  const years = Object.keys(countries[0].populationByYear); // Extract the years dynamically
  let currentYear = years[0]; // Start with the first year in the dataset

  // Add a year label at the top of the chart
  const yearLabel = svg
    .append("text")
    .attr("class", "year-label")
    .attr("x", width / 2)
    .attr("y", -30)
    .attr("text-anchor", "middle")
    .style("font-size", "24px")
    .text(`Year: ${currentYear}`);

  // Define the scales for the X and Y axes
  const xScale = d3.scaleBand().range([0, width]).padding(0.3);

  // Logarithmic scale for Y-axis to handle wide range of populations
  const yScale = d3
    .scaleLog()
    .domain([
      minPopulation,
      d3.max(countries, (c) => d3.max(Object.values(c.populationByYear))),
    ]) // Log scale domain
    .range([height, 0])
    .nice(); // `nice()` rounds the axis values to a clean range

  // Define the X and Y axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale).ticks(10, "~s"); // Custom tick format for log scale

  // Append the X axis to the SVG
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

  // Append the Y axis to the SVG
  svg.append("g").attr("class", "y-axis").call(yAxis);

  // Add Y-axis label
  svg
    .append("text")
    .attr("class", "y-axis-label")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${-50},${height / 2})rotate(-90)`)
    .style("font-size", "16px")
    .text("Animal Population (Log Scale)");

  // Add Y-axis label
  svg
    .append("text")
    .attr("class", "x-axis-label")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${width / 2},${height + 50})`)
    .style("font-size", "16px")
    .text("Country");

  // Add slider to control the year
  /*   const slider = d3
    .select("body")
    .append("input")
    .attr("type", "range")
    .attr("min", years[0])
    .attr("max", years[years.length - 1])
    .attr("step", 1) // One year step
    .attr("value", currentYear)
    .attr("id", "yearSlider");

  const sliderLabel = d3
    .select("body")
    .append("label")
    .attr("for", "yearSlider")
    .text(`Year: ${currentYear}`); */

  // Function to update the chart based on the selected year
  function updateChart(year) {
    // Filter the data for the selected year
    const animalData = countries.map((country) => ({
      name: country.name,
      animal: country.animal,
      icon: country.icon,
      flag: country.flag, // Added flag
      population: country.populationByYear[year],
    }));

    // Update the year label at the top
    yearLabel.text(`Year: ${year}`);
    //sliderLabel.text(`Year: ${year}`);

    // Update xScale domain based on the current data
    xScale.domain(animalData.map((d) => d.name));

    // Bind the new data to the bars
    const bars = svg.selectAll(".bar-group").data(animalData, (d) => d.name);

    // Enter phase: Create new group elements for bars and associated icons/text
    const enterBars = bars.enter().append("g").attr("class", "bar-group");

    // Append the bars
    enterBars
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.name))
      .attr("width", xScale.bandwidth())
      .attr("y", height) // Start the bars at the bottom of the chart
      .attr("height", 0) // Start with height 0 for animation effect
      .attr("fill", (d) => d3.schemeCategory10[animalData.indexOf(d)]); // Using D3's color scheme

    // Append flag images inside the bars
    enterBars
      .append("image")
      .attr("xlink:href", (d) => d.flag) // Use the flag data from the JSON
      .attr("x", (d) => xScale(d.name) + xScale.bandwidth() / 4)
      .attr("y", height - 40) // Initial y-position
      .attr("width", xScale.bandwidth() / 2)
      .attr("height", 40); // Set flag size

    // Append animal icons at the top of the bars
    enterBars
      .append("text")
      .attr("class", "animal-icon")
      .attr("x", (d) => xScale(d.name) + xScale.bandwidth() / 2)
      .attr("y", height)
      .attr("font-size", "24px")
      .attr("text-anchor", "middle")
      .text((d) => d.icon);

    // Append text for animal population
    enterBars
      .append("text")
      .attr("class", "animal-text")
      .attr("x", (d) => xScale(d.name) + xScale.bandwidth() / 2)
      .attr("y", height)
      .attr("font-size", "12px")
      .attr("text-anchor", "middle");

    // Merge the enter and update selections for bars and update their positions
    bars
      .merge(enterBars)
      .select(".bar")
      .transition()
      .duration(1000)
      .attr("x", (d) => xScale(d.name))
      .attr("y", (d) => yScale(Math.max(d.population, minPopulation))) // Ensure no values are below the minimum for log scale
      .attr(
        "height",
        (d) => height - yScale(Math.max(d.population, minPopulation))
      );

    // Move flag images inside the bars as they grow
    bars
      .merge(enterBars)
      .select("image")
      .transition()
      .duration(1000)
      .attr("x", (d) => xScale(d.name) + xScale.bandwidth() / 4)
      .attr("y", (d) => yScale(Math.max(d.population, minPopulation)) + 10) // Place flag near the top of the bar
      .attr("width", 24)
      .attr("height", 16);

    // Move animal icons and text with the bars
    bars
      .merge(enterBars)
      .select(".animal-icon")
      .transition()
      .duration(1000)
      .attr("x", (d) => xScale(d.name) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(Math.max(d.population, minPopulation)) - 20);

    bars
      .merge(enterBars)
      .select(".animal-text")
      .transition()
      .duration(1000)
      .attr("x", (d) => xScale(d.name) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(Math.max(d.population, minPopulation)) - 0)
      .text((d) => formatLargeNumber(d.population));

    function formatLargeNumber(value) {
      if (value >= 1000000000) {
        return (value / 1000000000).toFixed(1) + "B"; // Convert to billions (1.2B)
      } else if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + "M"; // Convert to millions (1.2M)
      } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + "K"; // Convert to thousands (1.2K)
      } else {
        return value; // If it's less than 1000, show the number as is
      }
    }

    // Exit phase: Remove any old bars no longer needed
    bars.exit().remove();

    // Update the X-axis
    svg.select(".x-axis").transition().duration(1000).call(xAxis);

    // Update the Y-axis to account for any changes in population scale
    svg.select(".y-axis").transition().duration(1000).call(yAxis);
  }

  // Initial chart rendering for the first year
  updateChart(currentYear);

  // Set the timer to auto-play through the years every 3 seconds
  let timer = setInterval(() => {
    let yearIndex = years.indexOf(currentYear);
    currentYear = years[(yearIndex + 1) % years.length];
    //slider.property("value", currentYear);
    updateChart(currentYear);
  }, 3000);

  // Stop the timer when the user interacts with the slider
  // slider.on("input", function () {
  //   clearInterval(timer); // Stop auto-play on interaction
  //   currentYear = this.value;
  //   updateChart(currentYear);
  //});
});
