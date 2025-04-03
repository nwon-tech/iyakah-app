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

    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      handleFileSelect(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener("change", (e) => {
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
});
