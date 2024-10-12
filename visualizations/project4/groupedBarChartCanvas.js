const canvas = document.getElementById("barChart");
const ctx = canvas.getContext("2d");
const slider = document.getElementById("yearSlider");
const yearLabel = document.getElementById("yearLabel");

const margin = { top: 120, right: 30, bottom: 80, left: 80 };
const width = canvas.width - margin.left - margin.right;
const height = canvas.height - margin.top - margin.bottom;

// Load the data from the external JSON file
fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    const countries = data.countries; // Array of countries
    const years = Object.keys(countries[0].animalPopulationByYear); // Extract the years dynamically
    let currentYear = years[0]; // Start with the first year in the dataset

    const x0Scale = (index) => margin.left + index * (width / countries.length);
    const x1Scale = (type, barWidth) =>
      type === "Animal Population" ? 0 : barWidth;

    // Linear Y-scale to make the bars fit the available height
    const maxPopulation = Math.max(
      ...countries.map((c) =>
        Math.max(...Object.values(c.humanPopulationByYear))
      )
    );
    const yScale = (population) =>
      height - (population / maxPopulation) * height; // Adjust Y-scale

    const barWidth = width / countries.length / 2;

    // Function to draw the chart
    function drawChart(year, animate = false) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the year label at the top
      ctx.font = "20px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`Year: ${year}`, canvas.width / 2, margin.top / 2);

      countries.forEach((country, index) => {
        const animalPopulation = country.animalPopulationByYear[year];
        const humanPopulation = country.humanPopulationByYear[year];

        const x0 = x0Scale(index);

        // Draw the animal population bar
        const yAnimal = yScale(animalPopulation);
        const animalBarHeight = height - yAnimal;
        const animalBarInitialHeight = animate ? 0 : animalBarHeight;

        ctx.fillStyle = "#4CAF50"; // Animal bar color
        animateBar(
          x0,
          height,
          barWidth,
          animalBarInitialHeight,
          animalBarHeight,
          animate
        );

        // Draw the human population bar
        const yHuman = yScale(humanPopulation);
        const humanBarHeight = height - yHuman;
        const humanBarInitialHeight = animate ? 0 : humanBarHeight;

        ctx.fillStyle = "#2196F3"; // Human bar color
        animateBar(
          x0 + barWidth,
          height,
          barWidth,
          humanBarInitialHeight,
          humanBarHeight,
          animate
        );

        // Draw animal icon
        ctx.font = "24px Arial";
        ctx.fillText(country.icon, x0 + barWidth / 2, yAnimal - 10);

        // Draw human icon
        ctx.fillText("🧑", x0 + barWidth + barWidth / 2, yHuman - 10);

        // Draw population text
        ctx.font = "12px Arial";
        ctx.fillText(
          animalPopulation.toLocaleString(),
          x0 + barWidth / 2,
          yAnimal - 30
        );
        ctx.fillText(
          humanPopulation.toLocaleString(),
          x0 + barWidth + barWidth / 2,
          yHuman - 30
        );

        // Draw flag inside the bar (scaled)
        const flagImage = new Image();
        flagImage.src = country.flag;
        flagImage.onload = function () {
          ctx.drawImage(
            flagImage,
            x0 + barWidth / 4,
            yHuman + 10,
            barWidth / 2,
            20
          );
          ctx.drawImage(
            flagImage,
            x0 + barWidth + barWidth / 4,
            yHuman + 10,
            barWidth / 2,
            20
          );
        };
      });

      // Draw X-axis
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(margin.left, margin.top + height);
      ctx.lineTo(margin.left + width, margin.top + height);
      ctx.stroke();

      // Draw X-axis labels (Country names)
      ctx.font = "14px Arial";
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      countries.forEach((country, index) => {
        const x0 = x0Scale(index) + barWidth / 2;
        ctx.fillText(country.name, x0 + barWidth / 2, margin.top + height + 20);
      });

      // Draw Y-axis
      ctx.beginPath();
      ctx.moveTo(margin.left, margin.top);
      ctx.lineTo(margin.left, margin.top + height);
      ctx.stroke();

      // Draw Y-axis labels (Population scale)
      ctx.textAlign = "right";
      ctx.font = "12px Arial";
      for (let i = 0; i <= 5; i++) {
        const y = margin.top + (i * height) / 5;
        const value = Math.round(
          (maxPopulation * (5 - i)) / 5
        ).toLocaleString();
        ctx.fillText(value, margin.left - 10, y + 5);
      }
    }

    // Animation for growing bars
    function animateBar(x, y, barWidth, startHeight, targetHeight, animate) {
      let progress = 0;
      const duration = 1000; // Animation duration in ms
      const startTime = performance.now();

      function drawFrame(time) {
        progress = (time - startTime) / duration;
        if (progress > 1) progress = 1;

        const currentHeight =
          startHeight + (targetHeight - startHeight) * progress;
        ctx.fillRect(x, y - currentHeight, barWidth, currentHeight);

        if (progress < 1 && animate) {
          requestAnimationFrame(drawFrame);
        }
      }

      if (animate) {
        requestAnimationFrame(drawFrame);
      } else {
        ctx.fillRect(x, y - targetHeight, barWidth, targetHeight);
      }
    }

    // Handle the slider input for the year
    slider.addEventListener("input", (event) => {
      currentYear = event.target.value;
      yearLabel.textContent = `Year: ${currentYear}`;
      drawChart(currentYear, true); // Call with animation
    });

    // Initial draw for the first year
    drawChart(currentYear);
  });
