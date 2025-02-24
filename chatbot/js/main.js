const sendButton = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const clearButton = document.getElementById("clear-btn");

const localStorageKey = "chat_history";
let messageHistory = JSON.parse(localStorage.getItem(localStorageKey)) || [];

function saveHistory() {
  localStorage.setItem(localStorageKey, JSON.stringify(messageHistory));
}

clearButton.addEventListener("click", () => {
  messageHistory = [];
  localStorage.removeItem(localStorageKey);
  document.location.reload();
});

function loadChatHistory() {
  document.getElementById("user-input").focus();
  messageHistory.forEach((msg) => {
    if (msg.role === "user") {
      appendMessage("user", msg.content);
    } else if (msg.role === "assistant") {
      appendHTMLMessage("bot", msg.content);
    }
  });
}

var blocker = false;
async function chatting() {
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  appendMessage("user", userMessage);

  // Add the new message to history
  messageHistory.push({ role: "user", content: userMessage });


  const formattedHistory = messageHistory.map((msg) => `${msg.role}: ${msg.content}`).join("\n");

  saveHistory();

  try {
    const response = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_input: formattedHistory,  
        system_prompt: "Antworte nur auf Schwäbisch",
        temperature: 0.7,
        model_name: "gpt-3.5-turbo",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to fetch response.");
    }

    const botReply = data.response;

    // Add bot response to history
    messageHistory.push({ role: "assistant", content: botReply });
    saveHistory();

    appendHTMLMessage("bot", botReply);
  } catch (error) {
    console.error("Error:", error);
    appendMessage("bot", "Error occurred while fetching response.");
  }
  
  blocker = true;
  userInput.active = true;
}

// Event Listeners for sending messages
userInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    chatting();
    userInput.value = "";
  }
});

sendButton.addEventListener("click", async () => {
  await chatting();
  userInput.value = "";
});

// Function to append user messages (plain text)
function appendMessage(sender, message) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("chat-message", sender);
  messageDiv.textContent = message;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to append bot messages (HTML)
function appendHTMLMessage(sender, htmlContent) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("chat-message", sender);
  messageDiv.innerHTML = htmlContent;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Load chat history when page loads
document.addEventListener("DOMContentLoaded", loadChatHistory);