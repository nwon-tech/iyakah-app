document.addEventListener("DOMContentLoaded", function () {

  const bubble = document.getElementById("chatbot-bubble");
  const windowEl = document.getElementById("chatbot-window");
  const closeBtn = document.getElementById("close-chat");
  const input = document.getElementById("chatbot-input");
  const sendBtn = document.getElementById("send-message");
  const messages = document.getElementById("chatbot-messages");
  const typingIndicator = document.getElementById("typing-indicator");
  const tooltip = document.getElementById("chatbot-tooltip");

  let typingAnimationInterval = null;

  // Toggle chat window with slide animation
  bubble.addEventListener("click", () => {
    if (windowEl.style.display === "block") {
      windowEl.style.display = "none";
      windowEl.classList.remove("open");
    } else {
      windowEl.style.display = "block";
      setTimeout(() => windowEl.classList.add("open"), 10); // trigger transition

      // Show initial message every time chat opens
      showInitialMessage();

      // Reset tooltip if hidden
      resetTooltip();
    }
  });

  closeBtn.addEventListener("click", () => {
    windowEl.style.display = "none";
  });

  // Show initial message from bot
  function showInitialMessage() {
    const initialMsg = "Hi! I'm here to help. How can I assist you today?";
    appendMessage(initialMsg, "bot");
  }

  // Format message: convert links and newlines
  function makeLinksClickable(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(
      urlRegex,
      (url) => `<a href="${url}" target="_blank">${url}</a>`
    );
  }

  function formatMessage(text) {
    let formatted = text.replace(/\n/g, "<br>");
    formatted = makeLinksClickable(formatted);
    return formatted;
  }

  // Append message to chat window
  function appendMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = `message ${sender}`;
    msg.innerHTML = formatMessage(text); // render HTML
    messages.appendChild(msg);

    // Scroll smoothly to bottom
    messages.scrollTo({
      top: messages.scrollHeight,
      behavior: "smooth",
    });
  }

  // Start animated typing indicator
  function startTypingAnimation() {
    let dotCount = 0;
    typingIndicator.style.display = "block";

    typingAnimationInterval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      typingIndicator.innerHTML = "Thinking" + ".".repeat(dotCount);
    }, 500);
  }

  // Stop animated typing indicator
  function stopTypingAnimation() {
    clearInterval(typingAnimationInterval);
    typingIndicator.style.display = "none";
  }

  // Send message via API
  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    appendMessage(text, "user");
    input.value = "";

    startTypingAnimation(); // Show animated typing

    try {
      const response = await fetch(
        "https://chatbot-assistant-z3ls.onrender.com/chat ",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: text }),
        }
      );

      const contentType = response.headers.get("content-type");

      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = { response: await response.text() };
      }

      stopTypingAnimation(); // Stop typing animation
      appendMessage(data.response, "bot");
    } catch (error) {
      stopTypingAnimation();
      appendMessage("❌ Unable to reach chatbot.", "bot");
    }
  }

  // Trigger send on Enter key
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  // Trigger send on button click
  sendBtn.addEventListener("click", sendMessage);

  // Tooltip behavior
  function resetTooltip() {
    tooltip.style.display = "none";
    setTimeout(() => {
      tooltip.style.display = "block";
    }, 5000); // Reappear after 5 seconds
  }

  tooltip.addEventListener("click", () => {
    tooltip.style.display = "none";
    setTimeout(() => {
      tooltip.style.display = "block";
    }, 5000); // Reappear after 5 seconds
  });
});
