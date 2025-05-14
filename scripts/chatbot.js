document.addEventListener("DOMContentLoaded", function () {
  const bubble = document.getElementById("chatbot-bubble");
  const windowEl = document.getElementById("chatbot-window");
  const closeBtn = document.getElementById("close-chat");
  const input = document.getElementById("chatbot-input");
  const sendBtn = document.getElementById("send-message");
  const messages = document.getElementById("chatbot-messages");

  // Toggle chat window
  bubble.addEventListener("click", () => {
    if (windowEl.style.display === "block") {
      windowEl.style.display = "none";
      windowEl.classList.remove("open");
    } else {
      windowEl.style.display = "block";
      setTimeout(() => windowEl.classList.add("open"), 10); // trigger transition
    }
  });

  closeBtn.addEventListener("click", () => {
    windowEl.style.display = "none";
  });

  //   greeting from chatbot
  function showInitialMessage() {
    const initialMsg = "Hi! I'm here to help. How can I assist you today?";
    appendMessage(initialMsg, "bot");
  }

  // Show only once
  if (!localStorage.getItem("chatbotOpened")) {
    showInitialMessage();
    localStorage.setItem("chatbotOpened", "true");
  }

  // Send message
  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    appendMessage(text, "user");
    input.value = "";

    console.log("Sending message:", text);

    try {
      const response = await fetch(
        "https://chatbot-assistant-z3ls.onrender.com/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: text }),
        }
      );

      const data = await response.json(); // Since the server returns plain text
      console.log("Response:", data.response);
      appendMessage(data.response, "bot");
    } catch (error) {
      console.error("Error:", error);
      appendMessage("❌ Unable to reach chatbot.", "bot");
    }
  }
  function makeLinksClickable(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(
      urlRegex,
      (url) => `<a href="${url}" target="_blank">${url}</a>`
    );
  }

  function formatMessage(text) {
    let formatted = text.replace(/\n/g, "<br>"); // Convert newlines to <br>
    formatted = makeLinksClickable(formatted); // Convert URLs to <a>
    return formatted;
  }

  //   function appendMessage(text, sender) {
  //     const msg = document.createElement("div");
  //     msg.className = `message ${sender}`;
  //     msg.innerHTML = formatMessage(text); // use innerHTML to render HTML
  //     messages.appendChild(msg);
  //     messages.scrollTop = messages.scrollHeight;
  //   }

  function appendMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = `message ${sender}`;
    // Format message
    const formattedText = formatMessage(text);

    // Use innerHTML to render HTML elements like <br>, <b>, <a>
    msg.innerHTML = formattedText;

    messages.appendChild(msg);
    messages.scrollTo({
      top: messages.scrollHeight,
      behavior: "smooth",
    });
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

  // remove tooltip after 5 seconds
  setTimeout(() => {
    const tooltip = document.getElementById("chatbot-tooltip");
    if (tooltip) tooltip.remove();
  }, 5000);

  //   bot is typing animation
  const typingIndicator = document.getElementById("typing-indicator");

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    appendMessage(text, "user");
    input.value = "";

    typingIndicator.style.display = "block"; // Show typing

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

      const data = await response.json();
      typingIndicator.style.display = "none"; // Hide typing
      appendMessage(data.response, "bot");
    } catch (error) {
      typingIndicator.style.display = "none";
      appendMessage("❌ Unable to reach chatbot.", "bot");
    }
  }
});
