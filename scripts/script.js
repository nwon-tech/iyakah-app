document.addEventListener("DOMContentLoaded", () => {
  // Tab switching functionality
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons and panes
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabPanes.forEach((pane) => pane.classList.remove("active"));

      // Add active class to clicked button and corresponding pane
      button.classList.add("active");
      const tabId = button.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");

      // Hide all result cards when switching tabs
      hideAllResults();
    });
  });

  // Option tabs for Fake News Detector
  const optionTabs = document.querySelectorAll(".option-tab");
  const optionContents = document.querySelectorAll(".option-content");

  optionTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all option tabs and contents
      optionTabs.forEach((t) => t.classList.remove("active"));
      optionContents.forEach((c) => c.classList.remove("active"));

      // Add active class to clicked tab and corresponding content
      tab.classList.add("active");
      const optionId = tab.getAttribute("data-option") + "-option";
      document.getElementById(optionId).classList.add("active");
    });
  });

  // Website Legitimacy Checker functionality
  const websiteInput = document.getElementById("website-input");
  const checkWebsiteButton = document.getElementById("check-website");

  checkWebsiteButton.addEventListener("click", () => {
    const websiteUrl = websiteInput.value.trim();

    if (websiteUrl) {
      // Show loading state
      checkWebsiteButton.disabled = true;
      checkWebsiteButton.textContent = "Checking...";

      // Make sure URL has a protocol, add http:// if none exists
      let processedUrl = websiteUrl;
      if (
        !processedUrl.startsWith("http://") &&
        !processedUrl.startsWith("https://")
      ) {
        processedUrl = "https://" + processedUrl;
      }

      // Prepare the data in the format expected by the Java backend
      const requestBody = {
        url: processedUrl,
      };

      // Convert the request body to JSON string
      const requestBodyString = JSON.stringify(requestBody);

      // Log the request for debugging
      console.log("Sending request to backend:", requestBodyString);

      // Get the API endpoint - use a local proxy if needed to avoid CORS issues
      const apiUrl =
        "https://www.pollucheck8.com:8088/analysislog/addAnalysisLogByUrl";

      // Send the website URL to the Java backend
      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: requestBodyString,
      })
        .then((response) => {
          // Reset button state
          checkWebsiteButton.disabled = false;
          checkWebsiteButton.textContent = "Check";

          if (!response.ok) {
            console.error("Response status:", response.status);
            throw new Error(
              `Failed to check website legitimacy (Status: ${response.status})`
            );
          }
          return response.json();
        })
        .then((data) => {
          console.log("Response from backend:", data);

          // data.data.resultSummary is the expected format for the result summary
          // data.data.confidenceScore is the expected format for the confidence score
          var websiteResultSummary =
            data.data.resultSummary || "No result available";
          var websiteConfidenceScore =
            data.data.confidenceScore || "No score available";

          // websiteLogId to check for dynamic update
          var websiteLogId = data.data.logId || "No log ID available";

          // urlResult
          var googleResult = data.data.urlResult.googleResult || "No result available";
          var officialResults = data.data.urlResult.officialResults || "No result available";
          var sslCaResult = data.data.urlResult.sslCaResult || "No result available";
          var sslValidityResult = data.data.urlResult.sslValidityResult || "No result available";
          var sslKeyResult = data.data.urlResult.sslKeyResult || "No result available";

          // formatting output
          if (websiteResultSummary.toLowerCase() === "safe website") {
            websiteResultSummary = "Safe Website";
          } else {
            websiteResultSummary = "Unsafe Website";
          }

          // Display the data on the index.html page
          const websiteResultContainer = document.getElementById(
            "website-result-container"
          );

          // <img src="scripts/website-detection-result/${
          //   websiteResultSummary === "Safe Website"
          //     ? "result-trustworthy.png"
          //     : "result-highrisk.png"
          // }" alt="${websiteResultSummary}" style="max-width: 100%; max-height: 200px; margin-bottom: 1rem;">
          //  <p>${websiteResultSummary}</p>

          if (websiteResultContainer) {
            websiteResultContainer.innerHTML = `
              <div class="result-card ${
                websiteResultSummary === "Safe Website" ? "safe" : "unsafe"
              }">
              <p>Log ID: ${websiteLogId}</p>
              <p>Confidence Score: ${websiteConfidenceScore}</p>
              <p>Google Result: ${googleResult}</p>
              <p>Official Results: ${officialResults}</p>
              <p>SSL CA Result: ${sslCaResult}</p>
              <p>SSL Validity Result: ${sslValidityResult}</p>
              <p>SSL Key Result: ${sslKeyResult}</p>
              <caption>All detection results are for informational purposes only and do not constitute professional or legal advice.</caption>
            </div>
            `;
          }
        })
        .catch((error) => {
          // Reset button state
          checkWebsiteButton.disabled = false;
          checkWebsiteButton.textContent = "Check";

          console.error("Error checking website:", error);

          // More detailed error message
          let errorMessage = "Error checking website. ";

          // Check if it's a network error
          if (
            error.message.includes("NetworkError") ||
            error.message.includes("Failed to fetch") ||
            error.message.includes("ERR_CONNECTION_RESET")
          ) {
            errorMessage +=
              "Cannot connect to the server. The server might be down or unreachable. Please try again later.";
          } else {
            errorMessage += "Please try again.";
          }

          alert(errorMessage);

          // Provide a way to test with mock data for development
          console.log("For development, you can use mock data to test the UI");
        });
    } else {
      alert("Please enter a valid website URL.");
    }
  });

  // Fake News Detector functionality
  const newsInput = document.getElementById("news-input");
  const checkNewsButton = document.getElementById("check-news");
  const mediaInput = document.getElementById("media-input");

  checkNewsButton.addEventListener("click", () => {
    const newsContent = newsInput.value.trim();
    const mediaName = mediaInput.value.trim();

    if (!newsContent) {
      alert("Please enter news content to check.");
      return;
    }
    // Prepare the data for API submission
    const formData = JSON.stringify({
      text: newsContent,
      mediaName: mediaName || null,
    });

    // Log the news content for debugging
    console.log("Sending news content to backend:", formData);

    // Send the news content to the Java backend
    fetch("https://www.pollucheck8.com:8088/analysislog/addAnalysisLogByNews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to check news legitimacy");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Response from backend:", data);

        var newsResultSummary =
          data.data.resultSummary || "No result available";
        var newsConfidenceScore =
          data.data.confidenceScore || "No score available";
        var newsMediaBiasRating =
          data.data.mediaBiasRating || "No rating available";
        var newsMediamediaBiasScore =
          data.data.mediaBiasScore || "No score available";

        // formatting output
        if (newsResultSummary.toLowerCase() === "AI-generated") {
          newsResultSummary = "Ai-Generated";
        } else {
          newsResultSummary = "Human-written";
        }

        // Display the data on the index.html page
        const newsResultContainer = document.getElementById(
          "news-result-container"
        );
        if (newsResultContainer) {
          newsResultContainer.innerHTML = `
            <div class="result-card ${
              newsResultSummary === "Ai-Generated" ? "safe" : "unsafe"
            }">
              <img src="scripts/news-detection-results/${
                newsResultSummary === "Ai-Generated"
                  ? "result-aigenerated.png"
                  : "result-real.png"
              }" alt="${newsResultSummary}" style="max-width: 100%; max-height: 200px; margin-bottom: 1rem;">
              <p>${newsResultSummary}</p>
              <p>Confidence Score: ${newsConfidenceScore}</p>
              <p>Media Bias Rating: ${newsMediaBiasRating}</p>
              <p>Media Bias Score: ${newsMediamediaBiasScore}</p>
              <caption>All detection results are for informational purposes only and do not constitute professional or legal advice.</caption>
            </div>
            `;
        }
      })
      .catch((error) => {
        console.error("Error checking news:", error);
        alert("Error checking news. Please try again.");
      });
  });
});

// Image upload functionality
const uploadArea = document.getElementById("upload-area");
const fileInput = document.getElementById("image-upload");
const analyzeButton = document.getElementById("analyze-image");

uploadArea.addEventListener("click", () => {
  fileInput.click();
});

uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadArea.classList.add("active");
});

uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("active");
});

uploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadArea.classList.remove("active");

  // handle image object for analysis
  if (e.dataTransfer.files.length) {
    fileInput.files = e.dataTransfer.files;
    handleFileSelect(e.dataTransfer.files[0]);
  }
});

fileInput.addEventListener("change", () => {
  if (fileInput.files.length) {
    handleFileSelect(fileInput.files[0]);
  }
});

function handleFileSelect(file) {
  if (file.type.startsWith("image/")) {
    // Display the selected image
    const reader = new FileReader();
    reader.onload = function (e) {
      uploadArea.innerHTML = `
          <img src="${e.target.result}" alt="Selected image" style="max-width: 100%; max-height: 200px; margin-bottom: 1rem;">
          <p>${file.name}</p>
        `;
    };
    reader.readAsDataURL(file);

    // Enable the analyze button
    analyzeButton.disabled = false;

    // Prepare the file for API submission (only add this event listener once)
    if (!analyzeButton.hasEventListener) {
      analyzeButton.hasEventListener = true;
      analyzeButton.addEventListener("click", () => {
        const formData = new FormData();
        formData.append("image", file);

        console.log("Image sent: ", formData);

        // Send the image to the Java backend
        fetch(
          "https://www.pollucheck8.com:8088/analysislog/addAnalysisLogByImage",
          {
            method: "POST",
            body: formData,
          }
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to upload image");
            }
            return response.json();
          })
          .then((data) => {
            console.log("Response from backend:", data);

            // seperate the result into variables
            var imageResultSummary =
              data.data.resultSummary || "No result available";
            var imageCaptureDate = data.data.captureDate || "No date available";
            var imageCaptureLocation =
              data.data.location || "No location available";
            var imageCameraModel =
              data.data.cameraModel || "No model available";

            // logID to check for dynamic update
            var imagelogId = data.data.logId || "No log ID available";

            // formatting output
            if (imageResultSummary === "Real Image") {
              imageResultSummary = "Real Image";
            } else {
              imageResultSummary = "AI-Generated Image";
            }

            // display the data on the index.html page
            const imageResultContainer = document.getElementById(
              "image-result-container"
            );
            if (imageResultContainer) {
              imageResultContainer.innerHTML = `
                <div class="result-card ${
                  imageResultSummary === "Real Image" ? "safe" : "unsafe"
                }">
                  <img src="scripts/image-detection-result/${
                    imageResultSummary === "Real Image"
                      ? "result-real.png"
                      : "result-aigenerated.png"
                  }" alt="${imageResultSummary}" style="max-width: 100%; max-height: 200px; margin-bottom: 1rem;">
                  <p>${imageResultSummary}</p>
                  <p>LogID: ${imagelogId}</p>
                  <p>Capture Date: ${imageCaptureDate}</p>
                  <p>Capture Location: ${imageCaptureLocation}</p>
                  <p>Camera Model: ${imageCameraModel}</p>
                  <caption>All detection results are for informational purposes only and do not constitute professional or legal advice.</caption>
                </div>
                `;
            }
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
            alert("Error uploading image. Please try again.");
          });
      });
    }
  } else {
    alert("Please select an image file.");
    resetUploadArea();
  }
}

function resetUploadArea() {
  uploadArea.innerHTML = `
      <span class="material-icons">cloud_upload</span>
      <p>Drag & drop an image or click to browse</p>
    `;
  fileInput.value = "";
  analyzeButton.disabled = true;
}

// Function to hide all result cards
function hideAllResults() {
  const resultCards = document.querySelectorAll(".result-card");
  resultCards.forEach((card) => {
    card.style.display = "none";
    card.className = card.className.replace(
      /\b(positive|negative|neutral)\b/g,
      ""
    );
  });
}

// autocomplete functionality for media name input

let items = [];

fetch("scripts/data.json")
  .then((response) => response.json())
  .then((data) => {
    items = data;
  });

const input = document.getElementById("media-input");
const resultsList = document.getElementById("autocomplete-results");

input.addEventListener("input", function () {
  const query = this.value.toLowerCase();
  resultsList.innerHTML = "";

  if (query.length === 0) return;

  const matches = items
    .filter((item) => item.site_name.toLowerCase().startsWith(query))
    .slice(0, 10); // Limit to 10 suggestions

  matches.forEach((match) => {
    const li = document.createElement("li");
    li.textContent = match.site_name;
    li.addEventListener("click", () => {
      input.value = match.site_name;
      resultsList.innerHTML = "";
    });
    resultsList.appendChild(li);
  });

  document.addEventListener("click", function (event) {
    if (!resultsList.contains(event.target) && event.target !== input) {
      resultsList.innerHTML = ""; // Clear results when clicking outside
    }
  });
});
