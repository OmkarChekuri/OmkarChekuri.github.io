// mockSocketService.js

// Initial stock data with base values, volatility, and empty data arrays
let stockData = [
  { symbol: "KNGX", baseValue: 25, data: [], volatility: 0.15 },
  { symbol: "PNNL", baseValue: 50, data: [], volatility: 0.045 },
  { symbol: "MNPL", baseValue: 70, data: [], volatility: 0.075 },
];

let lastTimestamp = {};

// Function to generate a more realistic stock price movement using a random walk approach
function getRandomGaussian(mean = 0, standardDeviation = 1) {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z * standardDeviation + mean;
}

// Function to simulate realistic OHLC data for candlesticks with volatility
function generateOHLCData(previousClose, volatility) {
  const drift = 0.001; // Small upward or downward drift
  const noise = getRandomGaussian(0, volatility); // Gaussian noise for realism
  const open = previousClose * (1 + drift + noise); // Generate an opening price close to the previous close
  const high = open * (1 + Math.random() * volatility); // High price slightly above the open
  const low = open * (1 - Math.random() * volatility); // Low price slightly below the open
  const close = low + Math.random() * (high - low); // Closing price within the high-low range

  return { open, high, low, close };
}

function simulateRealTimeUpdates(callback) {
  // Initialize the stock data with a base starting point and timestamp
  stockData = stockData.map((stock) => {
    const initialValue = stock.baseValue;
    lastTimestamp[stock.symbol] = new Date();

    return {
      ...stock,
      data: [
        {
          timestamp: new Date().toISOString(),
          open: initialValue,
          high: initialValue,
          low: initialValue,
          close: initialValue,
          value: initialValue,
        },
      ],
    };
  });

  // Send the initial stock data to the callback once
  callback(stockData);

  // Update stock data every second with new OHLC values
  setInterval(() => {
    const updatedData = stockData.map((stock) => {
      const newTimestamp = new Date(
        lastTimestamp[stock.symbol].getTime() + 1000
      );
      lastTimestamp[stock.symbol] = newTimestamp;

      const previousClose = stock.data[0].close; // Get the previous close value
      const { open, high, low, close } = generateOHLCData(
        previousClose,
        stock.volatility
      );

      // Return the updated stock object with the new OHLC data point
      return {
        ...stock,
        data: [
          {
            timestamp: newTimestamp.toISOString(),
            open,
            high,
            low,
            close,
            value: close, // Also use the close price for the line chart
          },
        ],
      };
    });

    // Send the updated OHLC data points to the callback function
    callback(updatedData);
  }, 1000); // Update data every second
}
