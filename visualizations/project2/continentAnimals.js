// Set up the dimensions and margins for the map
const width = 960;
const height = 500;

// Append SVG container for the map
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Define the map projection and path
const projection = d3
  .geoMercator()
  .scale(150)
  .translate([width / 2, height / 1.5]);

const path = d3.geoPath().projection(projection);

// Define the start and end years for the slider
const startYear = 2000;
const endYear = 2020;
let currentYear = startYear;
let timer;

// Define national animals, their position, and population over time for each country
const animalDataByYear = {
  2000: [
    {
      country: "Brazil",
      icon: "🐒",
      position: [-51.9253, -14.235],
      population: 100000,
    },
    {
      country: "USA",
      icon: "🦅",
      position: [-95.7129, 37.0902],
      population: 50000,
    },
    {
      country: "China",
      icon: "🐼",
      position: [104.1954, 35.8617],
      population: 80000,
    },
    {
      country: "Australia",
      icon: "🦘",
      position: [133.7751, -25.2744],
      population: 50000,
    },
    {
      country: "South Africa",
      icon: "🦁",
      position: [22.9375, -30.5595],
      population: 40000,
    },
    {
      country: "France",
      icon: "🦊",
      position: [2.2137, 46.6034],
      population: 30000,
    },
  ],
  2020: [
    {
      country: "Brazil",
      icon: "🦜",
      position: [-51.9253, -14.235],
      population: 150000,
    },
    {
      country: "USA",
      icon: "🐻",
      position: [-95.7129, 37.0902],
      population: 60000,
    },
    {
      country: "China",
      icon: "🐯",
      position: [104.1954, 35.8617],
      population: 100000,
    },
    {
      country: "Australia",
      icon: "🐨",
      position: [133.7751, -25.2744],
      population: 70000,
    },
    {
      country: "South Africa",
      icon: "🐘",
      position: [22.9375, -30.5595],
      population: 50000,
    },
    {
      country: "France",
      icon: "🦉",
      position: [2.2137, 46.6034],
      population: 35000,
    },
  ],
};

// Color scale for countries
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Create a year slider
const slider = d3
  .select("body")
  .append("input")
  .attr("type", "range")
  .attr("min", startYear)
  .attr("max", endYear)
  .attr("step", 1)
  .attr("value", startYear)
  .attr("id", "yearSlider");

const yearLabel = d3
  .select("body")
  .append("label")
  .attr("for", "yearSlider")
  .text("Year: 2000");

// Load the world map GeoJSON data
d3.json("https://d3js.org/world-110m.v1.json").then(function (worldData) {
  const countries = topojson.feature(
    worldData,
    worldData.objects.countries
  ).features;

  // Draw the map using the country data
  svg
    .selectAll("path")
    .data(countries)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", (d) => colorScale(d.id)) // Assign color to each country
    .attr("stroke", "#333")
    .attr("stroke-width", 0.5);

  // Tooltip for animal information
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Function to update the map with animals based on the selected year
  function updateMap(year) {
    const animalData = animalDataByYear[year];

    // Bind the data to the animal icons
    const animals = svg
      .selectAll("text.animal")
      .data(animalData, (d) => d.country);

    // Update existing animals
    animals
      .transition()
      .duration(1000)
      .attr("x", (d) => projection(d.position)[0])
      .attr("y", (d) => projection(d.position)[1])
      .attr("font-size", (d) => `${Math.sqrt(d.population) / 100}px`) // Adjust size based on population
      .text((d) => d.icon);

    // Enter new animals if necessary
    animals
      .enter()
      .append("text")
      .attr("class", "animal")
      .attr("x", (d) => projection(d.position)[0])
      .attr("y", (d) => projection(d.position)[1])
      .attr("font-size", (d) => `${Math.sqrt(d.population) / 100}px`) // Size of icon based on population
      .attr("text-anchor", "middle")
      .text((d) => d.icon)
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);

        tooltip
          .html(`<strong>${d.country}</strong><br>Population: ${d.population}`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    // Remove old animals if necessary
    animals.exit().remove();
  }

  // Function to auto-progress through the timeline
  function autoPlay() {
    if (currentYear <= endYear) {
      updateMap(currentYear);
      slider.property("value", currentYear);
      yearLabel.text(`Year: ${currentYear}`);
      currentYear++;
    } else {
      currentYear = startYear;
    }
  }

  // Call updateMap for the initial year (2000)
  updateMap(startYear);

  // Handle slider input to update year
  slider.on("input", function () {
    currentYear = +this.value;
    yearLabel.text(`Year: ${currentYear}`);
    updateMap(currentYear);
    clearInterval(timer); // Stop the automatic slider when user interacts
  });

  // Set the timer for auto-moving slider
  timer = setInterval(autoPlay, 2000); // Update every 2 seconds
});
