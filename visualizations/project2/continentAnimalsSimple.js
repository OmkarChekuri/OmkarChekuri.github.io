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
  .geoMercator() // Mercator projection for the map
  .scale(150)
  .translate([width / 2, height / 1.5]);

const path = d3.geoPath().projection(projection);

// Define animal icons for continents
const continentAnimals = [
  { continent: "Africa", icon: "🐘", position: [21.7587, 1.3733] }, // Elephant, centered in Africa
  { continent: "Asia", icon: "🐼", position: [100.6197, 34.0479] }, // Panda, centered in Asia
  { continent: "Europe", icon: "🦅", position: [10.4515, 51.1657] }, // Eagle, centered in Europe
  { continent: "North America", icon: "🦅", position: [-98.5795, 39.8283] }, // Bald eagle, North America
  { continent: "South America", icon: "🐒", position: [-63.6167, -38.4161] }, // Monkey, South America
  { continent: "Australia", icon: "🦘", position: [133.7751, -25.2744] }, // Kangaroo, Australia
  { continent: "Antarctica", icon: "🐧", position: [0.0, -82.8628] }, // Penguin, Antarctica
];

// Load the world map GeoJSON data
d3.json("https://d3js.org/world-110m.v1.json").then(function (worldData) {
  // Convert the GeoJSON data into usable features
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
    .attr("fill", "#ccc")
    .attr("stroke", "#333")
    .attr("stroke-width", 0.5);

  // Add animal icons to the continents
  svg
    .selectAll("text.animal")
    .data(continentAnimals)
    .enter()
    .append("text")
    .attr("class", "animal")
    .attr("x", (d) => projection(d.position)[0]) // Position the icon based on the continent's center
    .attr("y", (d) => projection(d.position)[1])
    .attr("font-size", "30px") // Adjust the icon size as needed
    .attr("text-anchor", "middle")
    .text((d) => d.icon);

  // Optional: Add tooltips for more info when hovering over the icons
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  svg
    .selectAll("text.animal")
    .on("mouseover", (event, d) => {
      tooltip.transition().duration(200).style("opacity", 0.9);

      tooltip
        .html(`<strong>${d.continent}</strong><br>Famous animal: ${d.icon}`)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 28}px`);
    })
    .on("mouseout", () => {
      tooltip.transition().duration(500).style("opacity", 0);
    });
});
