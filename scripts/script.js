// Create and append spinner styles to the document head
function displayChatbotResponse(responseText) {
  console.log("Chatbot response:", responseText);
  const container = document.getElementById("chatbot-result-container");
  if (!container) return;

  // Clean and format the response
  let cleanedText = cleanChatResponse(responseText);
  let htmlContent = convertMarkdownToHtml(cleanedText);

  container.innerHTML = `
    <div class="chatbot-card">
      <h3>Chatbot Analysis Summary</h3>
      <div class="chatbot-message">
        ${htmlContent}
      </div>
    </div>
  `;
}

function convertMarkdownToHtml(text) {
  // Replace **bold** with <strong>
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Replace * bullets with <ul><li>...</li></ul>
  const lines = text.split("\n");
  let result = "";
  let inList = false;

  lines.forEach((line) => {
    if (line.trim().startsWith("* ")) {
      if (!inList) {
        result += "<ul>";
        inList = true;
      }
      result += `<li>${line.substring(2)}</li>`;
    } else {
      if (inList) {
        result += "</ul>";
        inList = false;
      }
      if (line.trim()) {
        result += `<p>${line}</p>`;
      } else {
        result += "<br>";
      }
    }
  });

  if (inList) result += "</ul>";

  return result;
}

function cleanChatResponse(text) {
  // Remove common emojis (basic version)
  text = text.replace(/[\u{1F600}-\u{1F6FF}\u{2700}-\u{27BF}]/gu, "");

  // Remove extra spaces
  return text.trim();
}

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
    let dotCount = 0;
    const dotStates = [
      "Analysing",
      "Analysing.",
      "Analysing..",
      "Analysing...",
    ];
    let currentMessageIndex = 0;

    const messageStages = [
      { time: 0, text: "Analysing" },
      { time: 5000, text: "Still analysing" },
      { time: 10000, text: "Hang tight, almost there" },
      { time: 15000, text: "This is taking a bit longer than usual..." },
      {
        time: 20000,
        text: "Server is still working on it — thanks for your patience!",
      },
      {
        time: 25000,
        text: "We're making sure everything is accurate — almost done!",
      },
    ];

    closeBtn.classList.remove("error");
    closeBtn.disabled = true;
    closeBtn.classList.remove("hidden");
    closeBtn.textContent = "Analysing";

    let animationInterval;
    let messageTimers = [];

    // animate dots
    animationInterval = setInterval(() => {
      dotCount = (dotCount + 1) % dotStates.length;
      closeBtn.textContent = dotStates[dotCount];
    }, 500);

    // schedule messages
    messageStages.forEach((stage, i) => {
      const timer = setTimeout(() => {
        currentMessageIndex = i;
      }, stage.time);
      messageTimers.push(timer);
    });

    // update message text
    const messageUpdater = setInterval(() => {
      if (!closeBtn.disabled) return;
      closeBtn.textContent = dotStates[dotCount].replace(
        "Analysing",
        messageStages[currentMessageIndex].text
      );
    }, 500);

    fetchFunction()
      .then(() => {
        clearInterval(animationInterval);
        clearInterval(messageUpdater);
        messageTimers.forEach(clearTimeout);
        showResultReady();
      })
      .catch(() => {
        clearInterval(animationInterval);
        clearInterval(messageUpdater);
        messageTimers.forEach(clearTimeout);
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

    // validation checks
    let processedUrl = websiteUrl;

    // Step 2: Basic domain format check
    const domainRegex = /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

    // Remove protocol temporarily to validate domain
    let domainOnly = processedUrl.replace(/^https?:\/\//, "");

    if (!domainRegex.test(domainOnly)) {
      // Try adding .com if it's missing
      if (!domainOnly.includes(".")) {
        domainOnly += ".com";
      } else if (!/\.[a-zA-Z]{2,}$/.test(domainOnly)) {
        domainOnly += ".com";
      }

      // Rebuild URL
      processedUrl = domainOnly;
    }

    // Step 3: Add https:// if no protocol exists
    if (
      !processedUrl.startsWith("http://") &&
      !processedUrl.startsWith("https://")
    ) {
      processedUrl = "https://" + processedUrl;
    }

    console.log("Final processed URL:", processedUrl);

    // Continue with analysis
    websiteResultContainer.innerHTML = "";
    checkWebsiteButton.disabled = true;
    checkWebsiteButton.textContent = "Analysing...";

    if (websiteUrl) {
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

              // data.data.confidenceScore is the expected format for the confidence score
              var websiteConfidenceScore =
                data.data.confidenceScore || "No score available";
              console.log(
                "Confidence score from backend:",
                websiteConfidenceScore
              );

              // websiteLogId to check for dynamic update
              var websiteLogId = data.data.logId || "No log ID available";

              // urlResult
              var officialResults =
                data.data.urlResult.officialResults || "No result available";
              var officialResultsVerdict =
                data.data.urlResult.officialVerdict || "No result available";
              var officialResultsScore =
                data.data.urlResult.allScore || "No score available";
              

              //  format domain age
              var domainCreationDate =
                data.data.urlResult.domainAgeDescription ||
                "No date available";
              var domainAgeVerdict =
                data.data.urlResult.domainAgeDescriptionVerdict || "No result available";
              var domainAgeScore =
                data.data.urlResult.domainAgeDescriptionScore || "No score available";

              //  SSL certificate
              var sslCaResult =
                data.data.urlResult.sslCaResult || "No result available";
              var sslCaResultVerdict =
              data.data.urlResult.sslCaVerdict || "No result available";
              var sslCaResultScore =
                data.data.urlResult.sslCaScore || "No score available";

              // SSL validity
              var sslValidityResult =
                data.data.urlResult.sslValidityResult || "No result available";
              var sslValidityResultVerdict =
                data.data.urlResult.sslValidityVerdict || "No result available";
              var sslValidityResultScore =
                data.data.urlResult.sslValidityScore || "No score available";

              // SSL Key
              var sslKeyResult =
                data.data.urlResult.sslKeyResult || "No result available";
              var sslKeyResultVerdict =
                data.data.urlResult.sslKeyVerdict || "No result available";
              var sslKeyResultScore =
                data.data.urlResult.sslKeyScore || "No score available";


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
                  <td>Criteria</td>
                  <td>Results</td>
                  <td>Verdict</td>
                  <td>Score</td>
                </tr>
                <tr>
                  <td>Rating by Agencies</td>
                  <td>${officialResults}</td>
                  <td>${officialResultsVerdict}</td>
                  <td>${officialResultsScore}/40.0</td>
                </tr>
                <tr>
                  <td>Domain Creation Date</td>
                  <td>${domainCreationDate}</td>
                  <td>${domainAgeVerdict}/td>
                  <td>${domainAgeScore}/15.0</td>
                </tr>
                <tr>
                  <td>SSL Certificate</td>
                  <td>${sslCaResult}</td>
                  <td>${sslCaResultVerdict}</td>
                  <td>${sslCaResultScore}/10.0</td>
                </tr>
                <tr>
                  <td>SSL Validity</td>
                  <td>${sslValidityResult}</td>
                  <td>${sslValidityResultVerdict}/td>
                  <td>${sslValidityResultScore}/20.0</td>
                </tr>
                <tr>
                  <td>SSL Key</td>
                  <td>${sslKeyResult}</td>
                  <td>${sslKeyResultVerdict}</td>
                  <td>${sslKeyResultScore}/15.0</td>
                </tr>
              </tbody>
            </table>

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

              // chatbot response
              if (data.data.chatResponse) {
                displayChatbotResponse(data.data.chatResponse);
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
  let dotCount = 0;
  const dotStates = ["Analysing", "Analysing.", "Analysing..", "Analysing..."];
  let currentMessageIndex = 0;

  const messageStages = [
    { time: 0, text: "Analysing" },
    { time: 5000, text: "Still analysing" },
    { time: 10000, text: "Hang tight, almost there" },
    { time: 15000, text: "This is taking a bit longer than usual..." },
    {
      time: 20000,
      text: "Server is still working on it — thanks for your patience!",
    },
    {
      time: 25000,
      text: "We're making sure everything is accurate — almost done!",
    },
  ];

  closeBtn.classList.remove("error");
  closeBtn.disabled = true;
  closeBtn.classList.remove("hidden");
  closeBtn.textContent = "Analysing";

  let animationInterval;
  let messageTimers = [];

  // animate dots
  animationInterval = setInterval(() => {
    dotCount = (dotCount + 1) % dotStates.length;
    closeBtn.textContent = dotStates[dotCount];
  }, 500);

  // schedule messages
  messageStages.forEach((stage, i) => {
    const timer = setTimeout(() => {
      currentMessageIndex = i;
    }, stage.time);
    messageTimers.push(timer);
  });

  // update message text
  const messageUpdater = setInterval(() => {
    if (!closeBtn.disabled) return;
    closeBtn.textContent = dotStates[dotCount].replace(
      "Analysing",
      messageStages[currentMessageIndex].text
    );
  }, 500);

  fetchFunction()
    .then(() => {
      clearInterval(animationInterval);
      clearInterval(messageUpdater);
      messageTimers.forEach(clearTimeout);
      showResultReady();
    })
    .catch(() => {
      clearInterval(animationInterval);
      clearInterval(messageUpdater);
      messageTimers.forEach(clearTimeout);
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

                // chatbot response
                if (data.data.chatResponse) {
                  displayChatbotResponse(data.data.chatResponse);
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
