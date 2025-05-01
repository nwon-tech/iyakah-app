// Show spinner in target container
function showSpinner(containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = `<div class="spinner-container"><div class="spinner"></div></div>`;
}

// Fetch and render data from API
async function fetchAndDisplay(url, containerId) {
  const container = document.getElementById(containerId);
  showSpinner(containerId); // Show spinner while waiting

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json(); // result is full object

    // ✅ Only show the "data" field from the result object
    const data = result.data;

    // If data is an array, render it as a list
    if (Array.isArray(data)) {
      container.innerHTML = `<ul>${data
        .map((item) => `<li>${item}</li>`)
        .join("")}</ul>`;
    }
    // If data is an object, render prettified JSON (optional)
    else if (typeof data === "object") {
      container.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }
    // Otherwise, just render it as a string
    else {
      container.textContent = data;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    container.innerHTML = `<p style="color: red;">Failed to load data.</p>`;
  }
}

// Run fetches on page load
document.addEventListener("DOMContentLoaded", () => {
  fetchAndDisplay(
    "https://www.pollucheck8.com:8088/analysislog/getMostUseWebsite",
    "most-searched-website-container"
  );
  fetchAndDisplay(
    "https://www.pollucheck8.com:8088/analysislog/getMostPopularFeature",
    "most-popular-feature-container"
  );
  fetchAndDisplay(
    "https://www.pollucheck8.com:8088/analysislog/getMostCommonBias",
    "most-common-bias-container"
  );
});
