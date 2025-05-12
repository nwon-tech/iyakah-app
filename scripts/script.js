// Create and append spinner styles to the document head
function createSpinnerStyles() {
  const styleEl = document.createElement("style");
  styleEl.innerHTML = `
    .spinner-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
    }

    .spinner-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 5px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .upload-progress {
      width: 100%;
      height: 4px;
      background-color: #f1f1f1;
      border-radius: 2px;
      margin-top: 10px;
      overflow: hidden;
      display: none;
    }

    .upload-progress-bar {
      height: 100%;
      width: 0%;
      background-color: #4CAF50;
      border-radius: 2px;
      transition: width 0.3s ease;
    }

    .upload-area.uploading {
      border-color: #4CAF50;
    }

    .pulse-animation {
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.6; }
      100% { opacity: 1; }
    }
  `;
  document.head.appendChild(styleEl);
}

// Create spinner overlay element
function createSpinnerOverlay() {
  const overlay = document.createElement("div");
  overlay.className = "spinner-overlay";
  overlay.innerHTML = '<div class="spinner"></div>';
  document.body.appendChild(overlay);
  return overlay;
}

// Show spinner with timeout
function showSpinnerWithTimeout(timeout = 30000) {
  const spinner =
    document.querySelector(".spinner-overlay") || createSpinnerOverlay();
  spinner.classList.add("active");

  // Set timeout to hide spinner and show error if it takes too long
  const timeoutId = setTimeout(() => {
    hideSpinner();
    alert("Request timed out. Please try again later.");
  }, timeout);

  return { spinner, timeoutId };
}

// Hide spinner and clear timeout
function hideSpinner(timeoutId) {
  const spinner = document.querySelector(".spinner-overlay");
  if (spinner) {
    spinner.classList.remove("active");
  }
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Add spinner styles to document
  createSpinnerStyles();

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

  // info card for loading animations
  const infoCard = document.getElementById("loading-card");
  const infoMessage = document.getElementById("loading-message");
  const closeBtn = document.getElementById("loading-close-btn");

  // random facts about website verification and safety
  const facts = [
    "Did you know? Over 90% of phishing attacks are delivered via email.",
    "Fact: 1 in 3 people have fallen victim to a phishing attack at least once.",
    "Fact: 43% of cyber attacks target small businesses.",
    "Did you know? 95% of successful cyber attacks are due to human error.",
    "Fact: 60% of small businesses go out of business within 6 months of a cyber attack.",
  ];

  function showDidYouKnow() {
    const randomIndex = Math.floor(Math.random() * facts.length);
    const selectedFact = facts[randomIndex];

    infoMessage.textContent = selectedFact;
    closeBtn.classList.add("hidden");
    infoCard.classList.remove("hidden");
  }

  function showResultReady() {
    infoMessage.textContent = "The result is ready! Click below to view.";
    closeBtn.textContent = "View Results";
    closeBtn.classList.remove("hidden");
    closeBtn.disabled = false;
  }

  function showErrorState() {
    infoMessage.textContent = "An error occurred while fetching your result.";
    closeBtn.textContent = "An Error Has Occurred";
    closeBtn.classList.remove("hidden");
    closeBtn.disabled = true; // Optional: prevent clicking
    closeBtn.classList.add("error");
  }

  function hideInfoCard() {
    infoCard.classList.add("hidden");
    document
      .getElementById("news-result-container")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  closeBtn.addEventListener("click", () => {
    hideInfoCard();
  });

  // Wrap fetch logic in this modular function
  function showLoadingCard(fetchFunction) {
    showDidYouKnow();
    fetchFunction()
      .then(() => {
        showResultReady();
      })
      .catch(() => {
        showErrorState();
      });
  }

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
    // clear previous results
    const websiteResultContainer = document.getElementById("info-card-website");

    const websiteUrl = websiteInput.value.trim();

    if (websiteUrl) {
      // Show spinner with 30-second timeout
      // const { timeoutId } = showSpinnerWithTimeout(30000);

      // Clear previous results
      websiteResultContainer.innerHTML = "";

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

      showLoadingCard(() => {
        return new Promise((resolve, reject) => {
          const requestBodyString = JSON.stringify({
            url: processedUrl,
          });

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
              // Hide spinner and clear timeout
              // hideSpinner(timeoutId);

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
                      you're 100% sure the site is legitimate.
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
                      >Don't trust "too good to be true" offers</label
                    >
                    <p class="education-text">
                      If it promises huge rewards for little effort, it's probably a scam.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            `;
              }
              // Re-enable the button
              checkWebsiteButton.disabled = false;
              checkWebsiteButton.textContent = "Analyse";
              resolve();
            })
            .catch((error) => {
              // Hide spinner and clear timeout
              // hideSpinner(timeoutId);

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

              reject();

              // Provide a way to test with mock data for development
              console.log(
                "For development, you can use mock data to test the UI"
              );
            });
        });
      });
    } else {
      alert("Please enter a valid website URL.");
    }
  });
});

// Image upload functionality
const uploadArea = document.getElementById("upload-area");
const fileInput = document.getElementById("image-upload");
const analyzeButton = document.getElementById("analyze-image");

let file; // Global file variable to store the selected image

// Add progress bar to upload area
function addProgressBarToUploadArea() {
  // Check if progress bar already exists
  if (!uploadArea.querySelector(".upload-progress")) {
    const progressBar = document.createElement("div");
    progressBar.className = "upload-progress";
    progressBar.innerHTML = '<div class="upload-progress-bar"></div>';
    uploadArea.appendChild(progressBar);
  }
}

// Function to simulate upload progress
function simulateUploadProgress() {
  addProgressBarToUploadArea();

  const progressBar = uploadArea.querySelector(".upload-progress");
  const progressBarInner = uploadArea.querySelector(".upload-progress-bar");

  uploadArea.classList.add("uploading");
  progressBar.style.display = "block";
  progressBarInner.style.width = "0%";

  // Simulate progress animation
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress > 90) {
      clearInterval(interval);
      progress = 90; // Cap at 90%, will be completed when actually uploaded
    }
    progressBarInner.style.width = `${progress}%`;
  }, 200);

  return { progressBar, progressBarInner, interval };
}

// Complete upload progress
function completeUploadProgress(progressBar, progressBarInner, interval) {
  if (interval) clearInterval(interval);

  progressBarInner.style.width = "100%";

  // Remove the upload animation after a delay
  setTimeout(() => {
    uploadArea.classList.remove("uploading");
    progressBar.style.display = "none";
  }, 500);
}

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

// info card for loading animations
const infoCard = document.getElementById("loading-card");
const infoMessage = document.getElementById("loading-message");
const closeBtn = document.getElementById("loading-close-btn");

// random facts about website verification and safety
const facts = [
  "Did you know? Over 90% of phishing attacks are delivered via email.",
  "Fact: 1 in 3 people have fallen victim to a phishing attack at least once.",
  "Fact: 43% of cyber attacks target small businesses.",
  "Did you know? 95% of successful cyber attacks are due to human error.",
  "Fact: 60% of small businesses go out of business within 6 months of a cyber attack.",
];

function showDidYouKnow() {
  const randomIndex = Math.floor(Math.random() * facts.length);
  const selectedFact = facts[randomIndex];

  infoMessage.textContent = selectedFact;
  closeBtn.classList.add("hidden");
  infoCard.classList.remove("hidden");
}

function showResultReady() {
  infoMessage.textContent = "The result is ready! Click below to view.";
  closeBtn.textContent = "View Results";
  closeBtn.classList.remove("hidden");
  closeBtn.disabled = false;
}

function showErrorState() {
  infoMessage.textContent = "An error occurred while fetching your result.";
  closeBtn.textContent = "An Error Has Occurred";
  closeBtn.classList.remove("hidden");
  closeBtn.disabled = true; // Optional: prevent clicking
  closeBtn.classList.add("error");
}

function hideInfoCard() {
  infoCard.classList.add("hidden");
  document
    .getElementById("news-result-container")
    ?.scrollIntoView({ behavior: "smooth" });
}

closeBtn.addEventListener("click", () => {
  hideInfoCard();
});

// Wrap fetch logic in this modular function
function showLoadingCard(fetchFunction) {
  showDidYouKnow();
  fetchFunction()
    .then(() => {
      showResultReady();
    })
    .catch(() => {
      showErrorState();
    });
}

function handleFileSelect(selectedFile) {
  if (selectedFile.type.startsWith("image/")) {
    // Start upload progress animation
    const { progressBar, progressBarInner, interval } =
      simulateUploadProgress();

    // Display the selected image
    const reader = new FileReader();
    reader.onload = function (e) {
      // Complete upload progress
      completeUploadProgress(progressBar, progressBarInner, interval);

      uploadArea.innerHTML = `
          <img src="${e.target.result}" alt="Selected image" style="max-width: 100%; max-height: 200px; margin-bottom: 1rem;">
          <p>${selectedFile.name}</p>
        `;

      // Add the progress bar back to the upload area
      addProgressBarToUploadArea();
    };
    reader.readAsDataURL(selectedFile);

    // Enable the analyze button
    analyzeButton.disabled = false;

    // Prepare the file for API submission (only add this event listener once)
    if (!analyzeButton.hasEventListener) {
      analyzeButton.hasEventListener = true;
      analyzeButton.addEventListener("click", () => {
        // Show spinner with 30-second timeout
        // const { timeoutId } = showSpinnerWithTimeout(30000);

        analyzeButton.disabled = true;
        analyzeButton.textContent = "Analysing...";
        analyzeButton.classList.add("pulse-animation");

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

        showLoadingCard(() => {
          return new Promise((resolve, reject) => {
            // Send the image to the Java backend
            fetch(
              "https://www.pollucheck8.com:8088/analysislog/addAnalysisLogByImage",
              {
                method: "POST",
                body: formData,
              }
            )
              .then((response) => {
                // Hide spinner and clear timeout
                // hideSpinner(timeoutId);

                // Remove pulse animation
                analyzeButton.classList.remove("pulse-animation");

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
                let imageCaptureLocation =
                  data.data.location || "No location available";
                // Filming Equipment
                const imageCameraModel =
                  data.data.cameraModel || "No model available";

                let imageCaptureAddress = "No address available";

                // Reverse geocoding for filming locations
                // if (data.data.location) {
                //   fetchAddressFromCoordinates(data.data.location).then((result) => {
                //     imageCaptureLocation = result.coordinates;
                //     imageCaptureAddress = result.address;
                //   });
                // }

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
                resolve();
              })
              .catch((error) => {
                // Hide spinner and clear timeout
                // hideSpinner(timeoutId);

                // Remove pulse animation
                analyzeButton.classList.remove("pulse-animation");

                console.error("Error uploading image:", error);
                analyzeButton.disabled = false;
                analyzeButton.textContent = "Analyse";
                alert("Error uploading image. Please try again.");
                reject();
              });
          });
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
