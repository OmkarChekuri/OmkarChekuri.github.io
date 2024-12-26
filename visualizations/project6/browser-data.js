// Function to add information to the webpage
function addDataToPage(title, data) {
  const container = document.getElementById("browser-data");
  const section = document.createElement("section");
  const heading = document.createElement("h3");
  heading.textContent = title;
  section.appendChild(heading);

  data.forEach((info) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = `${info.label}: ${info.value}`;
    section.appendChild(paragraph);
  });

  container.appendChild(section);
}

// 1. Browser window information
addDataToPage("Browser Information", [
  { label: "User Agent", value: navigator.userAgent },
  { label: "Platform", value: navigator.platform },
  { label: "Language", value: navigator.language },
  { label: "Online", value: navigator.onLine ? "Yes" : "No" },
  { label: "Cookies Enabled", value: navigator.cookieEnabled ? "Yes" : "No" },
]);

// 2. Screen information
addDataToPage("Screen Information", [
  { label: "Screen Width", value: screen.width },
  { label: "Screen Height", value: screen.height },
  { label: "Available Screen Width", value: screen.availWidth },
  { label: "Available Screen Height", value: screen.availHeight },
  { label: "Color Depth", value: screen.colorDepth + " bits" },
]);

// 3. Window information
addDataToPage("Window Information", [
  { label: "Inner Window Width", value: window.innerWidth },
  { label: "Inner Window Height", value: window.innerHeight },
  { label: "Outer Window Width", value: window.outerWidth },
  { label: "Outer Window Height", value: window.outerHeight },
]);

// 4. Performance metrics using the Performance API
const timing = performance.timing;
addDataToPage("Performance Metrics", [
  {
    label: "Time to Interactive",
    value: timing.domContentLoadedEventEnd - timing.navigationStart + " ms",
  },
  {
    label: "Page Load Time",
    value: timing.loadEventEnd - timing.navigationStart + " ms",
  },
  {
    label: "Redirect Time",
    value: timing.redirectEnd - timing.redirectStart + " ms",
  },
  {
    label: "Domain Lookup Time",
    value: timing.domainLookupEnd - timing.domainLookupStart + " ms",
  },
  {
    label: "Server Connection Time",
    value: timing.connectEnd - timing.connectStart + " ms",
  },
]);

// 5. JavaScript memory usage (if available)
if (performance.memory) {
  addDataToPage("JavaScript Memory Usage", [
    {
      label: "Total JS Heap Size",
      value:
        (performance.memory.totalJSHeapSize / (1024 * 1024)).toFixed(2) + " MB",
    },
    {
      label: "Used JS Heap Size",
      value:
        (performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2) + " MB",
    },
    {
      label: "JS Heap Size Limit",
      value:
        (performance.memory.jsHeapSizeLimit / (1024 * 1024)).toFixed(2) + " MB",
    },
  ]);
} else {
  addDataToPage("JavaScript Memory Usage", [
    { label: "Memory Info", value: "Not available in this browser" },
  ]);
}

// 6. Navigation information
const navigation = performance.getEntriesByType("navigation")[0];
if (navigation) {
  addDataToPage("Navigation Information", [
    { label: "Navigation Type", value: navigation.type },
    { label: "Redirect Count", value: navigation.redirectCount },
  ]);
} else {
  addDataToPage("Navigation Information", [
    { label: "Navigation Info", value: "Not available" },
  ]);
}

// 7. Battery status (if supported)
if (navigator.getBattery) {
  navigator.getBattery().then((battery) => {
    addDataToPage("Battery Information", [
      { label: "Battery Level", value: (battery.level * 100).toFixed(0) + "%" },
      { label: "Charging", value: battery.charging ? "Yes" : "No" },
    ]);
  });
} else {
  addDataToPage("Battery Information", [
    { label: "Battery Info", value: "Not supported in this browser" },
  ]);
}

// 8. Performance observers for resource and paint timings
const performanceObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    addDataToPage("Performance Entry", [
      {
        label: `Type (${entry.entryType})`,
        value: `${entry.name} took ${entry.duration}ms`,
      },
    ]);
  });
});
performanceObserver.observe({ entryTypes: ["resource", "paint"] });

console.log("Browser-related data added to the webpage.");

// Live traffic monitoring (network activity)
const networkObserver = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    addDataToPage("Network Activity", [
      { label: "Resource", value: entry.name },
      { label: "Type", value: entry.initiatorType },
      { label: "Start Time", value: entry.startTime.toFixed(2) + " ms" },
      { label: "Duration", value: entry.duration.toFixed(2) + " ms" },
    ]);
  });
});

// Start observing 'resource' entries for network activity
networkObserver.observe({ entryTypes: ["resource"] });

// Function to display cookies
function displayCookies() {
  const cookies = document.cookie.split("; ").map((cookie) => {
    const [name, value] = cookie.split("=");
    return { label: name, value: value };
  });

  if (cookies.length > 0) {
    addDataToPage("Cookies", cookies);
  } else {
    addDataToPage("Cookies", [
      { label: "Cookie Data", value: "No cookies available" },
    ]);
  }
}

// Call the displayCookies function to show cookie data
displayCookies();

// Simulate network traffic by fetching an external resource
setTimeout(() => {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then((response) => response.json())
    .then((data) => console.log("Simulated network traffic fetched:", data))
    .catch((error) => console.error("Error fetching data:", error));
}, 3000); // Delays the fetch request by 3 seconds
