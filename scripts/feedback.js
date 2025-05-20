document.addEventListener("DOMContentLoaded", function () {
  const thumbUp = document.getElementById("thumb-up");
  const thumbDown = document.getElementById("thumb-down");
  const feedbackText = document.getElementById("feedback-text");
  const submitBtn = document.getElementById("submit-feedback");
  const successMsg = document.getElementById("success-message");

  let selectedRating = null;

  // Handle Thumb Up Click
  thumbUp.addEventListener("click", () => {
    selectedRating = 1;
    thumbUp.classList.add("active");
    thumbDown.classList.remove("active");
  });

  // Handle Thumb Down Click
  thumbDown.addEventListener("click", () => {
    selectedRating = 0;
    thumbDown.classList.add("active");
    thumbUp.classList.remove("active");
  });

  // Submit Feedback
  submitBtn.addEventListener("click", async () => {
    const comment = feedbackText.value.trim();

    // Build payload
    const payload = {
      feedbackRating: selectedRating,
      feedbackComment: comment,
      analysisType: "Website Verification",
    };

    // Optional: prevent empty submissions
    if (selectedRating === null && !comment) {
      alert("Please provide either a rating or a comment.");
      return;
    }

    try {
      const response = await fetch(
        "https://www.pollucheck8.com:8088/feedback/addFeedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      // Show success message
      successMsg.style.display = "block";
      setTimeout(() => {
        successMsg.style.display = "none";
      }, 5000);

      // Reset form
      thumbUp.classList.remove("active");
      thumbDown.classList.remove("active");
      feedbackText.value = "";
      selectedRating = null;
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again later.");
    }
  });
});
