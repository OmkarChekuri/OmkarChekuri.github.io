(function () {
  // Set up the dimensions and margins of the chart
  const margin = { top: 120, right: 30, bottom: 60, left: 60 };
  const width = 900 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // Append SVG container for the grouped bar chart
  const svg = d3
    .select("#chart-area2")
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
  d3.json("data.json").then(function (data) {
    const countries = data.countries; // Array of countries
    const years = Object.keys(countries[0].animalPopulationByYear); // Extract the years dynamically
    let currentYear = years[0]; // Start with the first year in the dataset

    // Define color scale for countries
    const colorScale = d3.scaleOrdinal(d3.schemeSet2);

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
    const x0 = d3.scaleBand().range([0, width]).padding(0.3); // For countries
    const x1 = d3.scaleBand().padding(0.05); // For animal and human population groups

    // Logarithmic scale for the y-axis
    const yScale = d3
      .scaleLog()
      .domain([
        1, // Minimum value for log scale
        d3.max(countries, (c) =>
          Math.max(
            ...Object.values(c.animalPopulationByYear),
            ...Object.values(c.humanPopulationByYear)
          )
        ),
      ])
      .range([height, 0])
      .nice();

    const formatLargeNumber = d3.format(".2s"); // Default SI notation with 2 significant digits

    // Define the X and Y axes
    const xAxis = d3.axisBottom(x0);
    //const yAxis = d3.axisLeft(yScale).ticks(10, "~s"); // Custom tick format for log scale
    // Append the X axis to the SVG

    const formatWithBForBillions = d3.format("~s");

    const customTickFormat = (d) => {
      const formatted = formatWithBForBillions(d);
      return formatted.replace("G", "B"); // Replace 'G' with 'B' for billions
    };

    const yAxis = d3.axisLeft(yScale).ticks(10).tickFormat(customTickFormat);
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
      .text("Population (Log Scale)");

    // Add Y-axis label
    svg
      .append("text")
      .attr("class", "x-axis-label")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${width / 2},${height + 50})`)
      .style("font-size", "16px")
      .text("Country");

    // Add slider to control the year
    /*     const slider = d3
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
      const animalHumanData = countries.map((country) => ({
        name: country.name,
        flag: country.flag,
        animalIcon: country.icon,
        humanIcon: "🧑", // Use a standard human icon for all countries
        animalPopulation: country.animalPopulationByYear[year],
        humanPopulation: country.humanPopulationByYear[year],
      }));

      // Update the year label at the top
      yearLabel.text(`Year: ${year}`);
      //sliderLabel.text(`Year: ${year}`);

      // Update the x0 scale domain with country names
      x0.domain(animalHumanData.map((d) => d.name)); // For countries

      // Update the x1 scale domain to differentiate between "Animal Population" and "Human Population"
      x1.domain(["Animal Population", "Human Population"]).range([
        0,
        x0.bandwidth(),
      ]);

      // Bind the new data to the bars
      const bars = svg
        .selectAll(".bar-group")
        .data(animalHumanData, (d) => d.name);

      // Enter phase: Create new group elements for bars
      const enterBars = bars.enter().append("g").attr("class", "bar-group");

      // Append animal and human population bars for each country
      enterBars
        .selectAll("rect")
        .data((d) => [
          {
            type: "Animal Population",
            value: d.animalPopulation,
            country: d.name,
            icon: d.animalIcon,
            flag: d.flag,
          },
          {
            type: "Human Population",
            value: d.humanPopulation,
            country: d.name,
            icon: d.humanIcon,
            flag: d.flag,
          },
        ])
        .enter()
        .append("rect")
        .attr("x", (d) => x0(d.country) + x1(d.type)) // Correct calculation using x0 for country and x1 for population type
        .attr("width", x1.bandwidth())
        .attr("y", height) // Initially position bars at the bottom
        .attr("height", 0) // Start height as 0 for animation
        .attr("fill", (d) => colorScale(d.country)) // Unique color for each country
        .transition() // Add transition when entering
        .duration(1000)
        .attr("y", (d) => yScale(d.value)) // Update the y position based on value
        .attr("height", (d) => height - yScale(d.value)); // Update the height based on value

      // Merge for updating existing bars
      bars
        .selectAll("rect")
        .data((d) => [
          {
            type: "Animal Population",
            value: d.animalPopulation,
            country: d.name,
          },
          {
            type: "Human Population",
            value: d.humanPopulation,
            country: d.name,
          },
        ])
        .transition()
        .duration(1000)
        .attr("x", (d) => x0(d.country) + x1(d.type))
        .attr("y", (d) => yScale(d.value))
        .attr("height", (d) => height - yScale(d.value));

      // Add icons and population text, merge them for updating transitions
      const iconSelection = bars.selectAll(".icon").data((d) => [
        {
          type: "Animal Population",
          value: d.animalPopulation,
          country: d.name,
          icon: d.animalIcon,
        },
        {
          type: "Human Population",
          value: d.humanPopulation,
          country: d.name,
          icon: d.humanIcon,
        },
      ]);

      iconSelection
        .enter()
        .append("text")
        .attr("class", "icon")
        .merge(iconSelection)
        .transition()
        .duration(1000)
        .attr("x", (d) => x0(d.country) + x1(d.type) + x1.bandwidth() / 2)
        .attr("y", (d) => yScale(d.value) - 20) // Position icon above the bar
        .attr("text-anchor", "middle")
        .attr("font-size", "24px")
        .text((d) => d.icon);

      const populationTextSelection = bars
        .selectAll(".population-text")
        .data((d) => [
          {
            type: "Animal Population",
            value: d.animalPopulation,
            country: d.name,
          },
          {
            type: "Human Population",
            value: d.humanPopulation,
            country: d.name,
          },
        ]);

      /*       populationTextSelection
        .enter()
        .append("text")
        .attr("class", "population-text")
        .merge(populationTextSelection)
        .transition()
        .duration(1000)
        .attr("x", (d) => x0(d.country) + x1(d.type) + x1.bandwidth() / 2)
        .attr("y", (d) => yScale(d.value) - 3)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text((d) => d.value.toLocaleString()); */

      populationTextSelection
        .enter()
        .append("text")
        .attr("class", "population-text")
        .merge(populationTextSelection)
        .transition()
        .duration(1000)
        .attr("x", (d) => x0(d.country) + x1(d.type) + x1.bandwidth() / 2)
        .attr("y", (d) => yScale(d.value) - 3)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text((d) => formatLargeNumber(d.value)); // Use a custom formatter

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

      // Add and update flags
      const flagSelection = bars.selectAll(".flag").data((d) => [
        {
          type: "Animal Population",
          value: d.animalPopulation,
          country: d.name,
          flag: d.flag,
        },
        {
          type: "Human Population",
          value: d.humanPopulation,
          country: d.name,
          flag: d.flag,
        },
      ]);

      flagSelection
        .enter()
        .append("image")
        .attr("class", "flag")
        .merge(flagSelection)
        .transition()
        .duration(1000)
        .attr("x", (d) => x0(d.country) + x1(d.type) + x1.bandwidth() / 2 - 12)
        .attr("y", (d) => yScale(d.value) + 5)
        .attr("width", 24)
        .attr("height", 16)
        .attr("href", (d) => d.flag);

      // Exit phase: Remove any old elements no longer needed
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
    /*     slider.on("input", function () {
      clearInterval(timer); // Stop auto-play on interaction
      currentYear = this.value;
      updateChart(currentYear);
    }); */
  });
})();
