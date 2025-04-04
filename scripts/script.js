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

      // Prepare the file for API submission
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
      // Prepare the data for API submission
      const formData = new FormData();
      formData.append("url", websiteUrl);

      // Send the website URL to the Java backend
      fetch("http://your-java-backend-url/api/check-website", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to check website legitimacy");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Response from backend:", data);
          alert(`Website legitimacy result: ${data.result}`);
        })
        .catch((error) => {
          console.error("Error checking website:", error);
          alert("Error checking website. Please try again.");
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
      const formData = new FormData();
      formData.append("news", newsContent);

      // Send the news content to the Java backend
      fetch("http://your-java-backend-url/api/check-news", {
        method: "POST",
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
