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
      checkWebsiteButton.textContent = "Analysing...";

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
          checkWebsiteButton.textContent = "Analyse";

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
          var googleResult =
            data.data.urlResult.googleResult || "No result available";
          var officialResults =
            data.data.urlResult.officialResults || "No result available";
          var sslCaResult =
            data.data.urlResult.sslCaResult || "No result available";
          var sslValidityResult =
            data.data.urlResult.sslValidityResult || "No result available";
          var sslKeyResult =
            data.data.urlResult.sslKeyResult || "No result available";

          // formatting output
          // if (websiteResultSummary.toLowerCase() === "safe website") {
          //   websiteResultSummary = "Safe Website";
          // } else {
          //   websiteResultSummary = "Unsafe Website";
          // }

          var safetyRating = "";
          var imgRating = "";

          if (websiteConfidenceScore < 50) {
            safetyRating = "High Risk";
            imgRating =
              "./scripts/website-detection-result/website-unsafe-icon.png";
          } else if (websiteConfidenceScore < 70) {
            safetyRating = "Doubtful";
            imgRating =
              "./scripts/website-detection-result/website-doubtful-icon.png";
          } else {
            safetyRating = "Safe";
            imgRating =
              "./scripts/website-detection-result/website-safe-icon.png";
          }

          // Display the data on the index.html page
          const websiteResultContainer =
            document.getElementById("info-card-website");

          if (websiteResultContainer) {
            websiteResultContainer.innerHTML = `

            <div class="info-card">
              <div class="info-icon">
                <img src="${imgRating}" alt="${safetyRating}" style="max-width: 100%; max-height: 200px; margin-bottom: 1rem;">
                <span class="label">${safetyRating}</span>
              </div>
              <div class="info-value">${websiteConfidenceScore}</div>
            </div>
            <p>All detection results are for informational purposes only and do not constitute professional or legal advice.</p>

            <table>
              <caption>
                Google Safe Service Results
              </caption>

              <colgroup>
                <col style="width: 30%" />
                <col style="width: 70%" />
              </colgroup>

              <tbody>
                <tr>
                  <td>Results</td>
                  <td>${googleResult}</td>
                </tr>
                <tr>
                  <td>Rating by Agencies</td>
                  <td>${officialResults}</td>
                </tr>
                <tr>
                  <td>SSL Certificate</td>
                  <td>${sslCaResult}</td>
                </tr>
                <tr>
                  <td>SSL Validity</td>
                  <td>${sslValidityResult}</td>
                </tr>
                <tr>
                  <td>SSL Key</td>
                  <td>${sslKeyResult}</td>
                </tr>
              </tbody>
            </table>

            <div>
            <section class="hero-feedback">
              <div class="feedback-container">
                <h2>Your Feedback Matters</h2>

                <div class="feedback-row">
                  <label class="feedback-label">Was this result helpful?</label>
                  <div class="feedback-buttons">
                    <button class="thumb-btn" id="thumb-up" aria-label="Thumbs up">
                      👍🏻
                    </button>
                    <button class="thumb-btn" id="thumb-down" aria-label="Thumbs down">
                      👎🏻
                    </button>
                  </div>
                </div>

                <div class="feedback-row">
                  <label class="feedback-label">Tell us more (optional)</label>
                  <input type="text" id="feedback-text" placeholder="Please enter your feedback" />
                  <button class="submit-btn">Submit</button>
                </div>
              </div>
            </section>
            </div>

            <div class="website-education">
              <section>
                <h2>How to Spot a Phishing or Scam Website</h2>

                <div class="education-row">
                  <div class="text-container-left">
                    <label class="education-label">Check the URL carefully</label>
                    <p class="education-text">
                      Avoid websites with strange spellings, extra characters, or unfamiliar
                      domain extensions (like .xyz, .top, etc.).
                    </p>
                  </div>
                  <div class="image-container">
                    <img
                      src="./scripts/website-detection-result/website-education-row1.jpg"
                      alt="URL Check"
                    />
                  </div>
                  <div class="text-container-right">
                    <label class="education-label"
                      >Never enter sensitive info on suspicious pages</label
                    >
                    <p class="education-text">
                      Avoid giving your passwords, ID numbers, or payment details unless
                      you’re 100% sure the site is legitimate.
                    </p>
                  </div>
                </div>

                <div class="education-row">
                  <div class="text-container-left-2">
                    <label class="education-label"
                      >Watch for urgent messages or threats</label
                    >
                    <p class="education-text">
                      Scam sites often try to scare you with fake deadlines or account
                      closures.
                    </p>
                  </div>
                  <div class="image-container-2">
                    <img
                      src="./scripts/website-detection-result/website-education-row2.png"
                      alt="URL Check"
                    />
                  </div>
                  <div class="text-container-right-2">
                    <label class="education-label">Look for HTTPS & the padlock icon</label>
                    <p class="education-text">
                      Legitimate sites use secure connections. No padlock = risky.
                    </p>
                  </div>
                </div>

                <div class="education-row">
                  <div class="text-container-left-3">
                    <label class="education-label"
                      >Check for spelling & design errors</label
                    >
                    <p class="education-text">
                      Poor grammar, weird formatting, or low-quality images can be a red
                      flag.
                    </p>
                  </div>
                  <div class="image-container-3">
                    <img
                      src="./scripts/website-detection-result/website-education-row3.jpg"
                      alt="URL Check"
                    />
                  </div>
                  <div class="text-container-right-3">
                    <label class="education-label"
                      >Don’t trust “too good to be true” offers</label
                    >
                    <p class="education-text">
                      If it promises huge rewards for little effort, it’s probably a scam.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            `;
          }
        })
        .catch((error) => {
          // Reset button state
          checkWebsiteButton.disabled = false;
          checkWebsiteButton.textContent = "Analyse";

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
    } else {
      checkNewsButton.disabled = true;
      checkNewsButton.textContent = "Checking...";
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
        // Reset button state
        checkNewsButton.disabled = false;
        checkNewsButton.textContent = "Check";

        console.error("Error checking news:", error);
        alert("Error checking news. Please try again.");
      });
  });
});

// Image upload functionality
const uploadArea = document.getElementById("upload-area");
const fileInput = document.getElementById("image-upload");
const analyzeButton = document.getElementById("analyze-image");

let file; // Global file variable to store the selected image

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
    file = e.dataTransfer.files[0]; // Update the global file variable
    handleFileSelect(file);
  }
});

// Single event listener for file input change
fileInput.addEventListener("change", (event) => {
  if (event.target.files.length) {
    file = event.target.files[0]; // Update the global file variable
    console.log("File updated:", file);
    handleFileSelect(file);
  }
});

function handleFileSelect(selectedFile) {
  if (selectedFile.type.startsWith("image/")) {
    // Display the selected image
    const reader = new FileReader();
    reader.onload = function (e) {
      uploadArea.innerHTML = `
          <img src="${e.target.result}" alt="Selected image" style="max-width: 100%; max-height: 200px; margin-bottom: 1rem;">
          <p>${selectedFile.name}</p>
        `;
    };
    reader.readAsDataURL(selectedFile);

    // Enable the analyze button
    analyzeButton.disabled = false;

    // Prepare the file for API submission (only add this event listener once)
    if (!analyzeButton.hasEventListener) {
      analyzeButton.hasEventListener = true;
      analyzeButton.addEventListener("click", () => {
        analyzeButton.disabled = true;
        analyzeButton.textContent = "Analysing...";

        // Clear the previous results
        const imageResultContainer = document.getElementById(
          "image-result-container"
        );

        if (imageResultContainer) {
          imageResultContainer.innerHTML = "";
        }

        const formData = new FormData();
        formData.append("image", file); // Using the global file variable

        console.log("Image sent: ", file.name); // Log the file name being sent

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
            console.log("Response status:", response.status);
            return response.json();
          })
          .then((data) => {
            console.log("Response from backend:", data);

            // labelling the image
            const imageResultSummary =
              data.data.resultSummary || "No result available";
            const imageConfidenceScore =
              data.data.confidenceScore || "No score available";

            // Metadata Field (only present for actual DSLR images)
            // Shooting Date
            const imageCaptureDate =
              data.data.captureDate || "No date available";
            // Filming Locations
            const imageCaptureLocation =
              data.data.location || "No location available";
            // Filming Equipment
            const imageCameraModel =
              data.data.cameraModel || "No model available";

            // Formatting output
            const resultText =
              imageResultSummary === "Real Image" ? "Real" : "AI-Generated";

            let imgRating = "";

            // update info card based on the result
            if (resultText === "Real") {
              imgRating =
                "./scripts/image-detection-result/image-safe-icon.png";
            } else {
              imgRating =
                "./scripts/image-detection-result/image-unsafe-icon.png";
            }

            // Display the data on the index.html page
            if (imageResultContainer) {
              imageResultContainer.innerHTML = `

                <div class="info-container">
                  <div class="info-card">
                    <div class="info-icon">
                      <img
                        src="${imgRating}"
                        alt="${resultText}"
                        style="max-width: 100%; max-height: 200px; margin-bottom: 1rem"
                      />
                      <span class="label">${resultText}</span>
                    </div>
                    <div class="info-value">${imageConfidenceScore}</div>
                  </div>
                  <div class="info-metadata">
                    <div class="info-metadata-header">
                      <h3>Metadata</h3>
                    </div>
                    <div class="info-metadata-content">
                      <h4>Shooting Date</h4>
                      <p>${imageCaptureDate}</p>
                    </div>
                    <div class="info-metadata-content">
                      <h4>Filming Locations</h4>
                      <p>${imageCaptureLocation}</p>
                    </div>
                    <div class="info-metadata-content">
                      <h4>Filming Equipment</h4>
                      <p>${imageCameraModel}</p>
                    </div>
                  </div>
                </div>

                <p>All detection results are for informational purposes only and do not constitute professional or legal advice.</p>

                <div>
                <section class="hero-feedback">
                  <div class="feedback-container">
                    <h2>Your Feedback Matters</h2>

                    <div class="feedback-row">
                      <label class="feedback-label">Was this result helpful?</label>
                      <div class="feedback-buttons">
                        <button class="thumb-btn" id="thumb-up" aria-label="Thumbs up">
                          👍🏻
                        </button>
                        <button class="thumb-btn" id="thumb-down" aria-label="Thumbs down">
                          👎🏻
                        </button>
                      </div>
                    </div>

                    <div class="feedback-row">
                      <label class="feedback-label">Tell us more (optional)</label>
                      <input type="text" id="feedback-text" placeholder="Please enter your feedback" />
                      <button class="submit-btn">Submit</button>
                    </div>
                  </div>
                </section>
                </div>

                <div class="website-education">
                <section>
                  <h2>How to Spot AI-Generated Images</h2>

                  <div class="education-row">
                    <div class="text-container">
                      <label class="education-label">Check for distorted details</label>
                      <p class="education-text">
                        AI images often have strange hands, mismatched earrings, or unnatural eyes and teeth.
                      </p>
                    </div>
                  </div>

                  <div class="education-row">
                        <div class="text-container-left-2">
                          <label class="education-label"
                            >Look at the background</label
                          >
                          <p class="education-text">
                            Blurry or chaotic backgrounds can be a sign the image was generated by AI.
                          </p>
                        </div>
                        <div class="image-container-2">
                          <img
                            src="./scripts/image-detection-result/image-education-row2.jpg"
                            alt="image check"
                          />
                        </div>
                        <div class="text-container-right-2">
                          <label class="education-label">Look for symmetry issues</label>
                          <p class="education-text">
                            Faces or objects may be oddly symmetrical — or not symmetrical when they should be.
                          </p>
                        </div>
                      </div>

                      <div class="education-row">
                        <div class="text-container">
                          <label class="education-label">Lighting and shadows may be off</label>
                          <p class="education-text">
                            Inconsistencies in lighting or shadow direction are common in AI-created images.
                          </p>
                        </div>
                      </div>
                    </section>
                  </div>

              `;
            }

            analyzeButton.disabled = false;
            analyzeButton.textContent = "Analyse";
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
            analyzeButton.disabled = false;
            analyzeButton.textContent = "Analyse";
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
  file = null; // Clear the global file variable

  analyzeButton.disabled = false;
  analyzeButton.textContent = "Check";
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
  console.log("Received autocomplete input");
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

// feedback form
feather.replace();

// Optional: toggle button state
const up = document.getElementById("thumb-up");
const down = document.getElementById("thumb-down");

up.addEventListener("click", () => {
  up.classList.add("active");
  down.classList.remove("active");
});

down.addEventListener("click", () => {
  down.classList.add("active");
  up.classList.remove("active");
});
