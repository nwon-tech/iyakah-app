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

  // document.addEventListener("DOMContentLoaded", function () {
  //   const mediaNames = []; // This list will be populated from script.js
  //   const input = document.getElementById("media-name");
  //   const autocompleteList = document.getElementById("autocomplete-list");

  //   input.addEventListener("input", function () {
  //     const query = this.value.toLowerCase();
  //     autocompleteList.innerHTML = ""; // Clear previous suggestions

  //     if (!query) return;

  //     const matches = mediaNames.filter((name) =>
  //       name.toLowerCase().includes(query)
  //     );

  //     matches.forEach((match) => {
  //       const item = document.createElement("button");
  //       item.className = "list-group-item list-group-item-action";
  //       item.textContent = match;
  //       item.addEventListener("click", function () {
  //         input.value = match;
  //         autocompleteList.innerHTML = ""; // Clear suggestions
  //       });
  //       autocompleteList.appendChild(item);
  //     });
  //   });

  //   document.addEventListener("click", function (e) {
  //     if (e.target !== input) {
  //       autocompleteList.innerHTML = ""; // Close suggestions when clicking outside
  //     }
  //   });
  // });

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

    // Hide all loading indicators
    const loadingSpinners = document.querySelectorAll(".spinner-container");
    loadingSpinners.forEach((spinner) => {
      spinner.style.display = "none";
    });
  }

  // Removed unused functions: showLoading, hideLoading, and showResult

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

          // Send the image to the Java backend
          fetch("http://your-java-backend-url/api/upload", {
            method: "POST",
            body: formData,
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to upload image");
              }
              return response.json();
            })
            .then((data) => {
              console.log("Response from backend:", data);
              alert("Image uploaded successfully!");
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

  // Reset upload area when switching tabs
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.getAttribute("data-tab") !== "tab3") {
        resetUploadArea();
      }
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
        "https://149.104.26.84:8088/analysislog/addAnalysisLogByUrl";

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

          // Extract the result from the response
          let resultMessage = "Analysis complete";
          if (data && data.result) {
            resultMessage = `Website legitimacy result: ${data.result}`;
          } else if (data && data.message) {
            resultMessage = data.message;
          } else {
            resultMessage = "Analysis complete. See console for details.";
          }

          alert(resultMessage);
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

  checkNewsButton.addEventListener("click", () => {
    const newsContent = newsInput.value.trim();

    if (newsContent) {
      // Prepare the data for API submission
      const formData = JSON.stringify({ text: newsContent });

      // Log the news content for debugging
      console.log("Sending news content to backend:", formData);

      // Send the news content to the Java backend
      fetch("http://149.104.26.84:8088/analysislog/addAnalysisLogByNews", {
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
          alert(`Fake news detection result: ${data.result}`);
        })
        .catch((error) => {
          console.error("Error checking news:", error);
          alert("Error checking news. Please try again.");
        });
    } else {
      alert("Please enter news content to analyze.");
    }
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
    const apiUrl = "https://149.104.26.84:8088/analysislog/addAnalysisLogByUrl";

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

        // Extract the result from the response
        let resultMessage = "Analysis complete";
        if (data && data.result) {
          resultMessage = `Website legitimacy result: ${data.result}`;
        } else if (data && data.message) {
          resultMessage = data.message;
        } else {
          resultMessage = "Analysis complete. See console for details.";
        }

        alert(resultMessage);
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

const get = document.getElementById("getAQI");

get.addEventListener("click", () => {
  const getURL = "https://www.pollucheck8.com:8088/cityaqi/getCityAqi/35";

  console.log("Sending GET request to backend:", getURL);

  fetch(getURL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Response from backend:", data);
      alert(`Data fetched successfully!`);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      alert("Error fetching data. Please try again.");
    });
});
