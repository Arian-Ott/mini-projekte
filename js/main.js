const sendButton = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const secretKey = "";
const localStorageKey = "chatMessageHistory";
const clearButton = document.getElementById("clear-btn");

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

  messageHistory.push({ role: "user", content: userMessage });
  saveHistory();

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        temperature: 0,
        messages: messageHistory,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to fetch response.");
    }

    const botReply = data.choices[0].message.content;

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
