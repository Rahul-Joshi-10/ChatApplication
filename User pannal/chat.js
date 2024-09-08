document.addEventListener("DOMContentLoaded", function () {
  // Check if there's a stored userId in local storage
  const userId = localStorage.getItem("userId");

  if (!userId) {
    // If no userId is found, ask for user information
    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    if (!userData.name) {
      askUserName();
    } else if (!userData.phone) {
      askPhoneNumber();
    } else if (!userData.email) {
      askEmail();
    } else {
      // If user information is complete, allow them to start chatting
      fetchAndDisplayMessages();
    }
  } else {
    // If userId is found, fetch and display existing messages
    fetchAndDisplayMessages();
  }

  const chatInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("btn");

  // Handle user input when Enter key is pressed
  chatInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      handleUserInput(chatInput.value);
      chatInput.value = ""; // Clear the input after handling
    }
  });

  // Handle user input when the Send button is clicked
  sendBtn.addEventListener("click", function () {
    handleUserInput(chatInput.value);
    chatInput.value = ""; // Clear the input after handling
  });

  // Handle user input when the Clear button is clicked
  const clearButton = document.getElementById("clear-storage-button");
  if (clearButton) {
    clearButton.addEventListener("click", function () {
      clearLocalStorage();
    });
  }

  let userData = JSON.parse(localStorage.getItem("userData")) || {};
  let initialMessageShown = false; // Flag to track if the initial message is shown

  function askUserName() {
    appendMessage("Admin: Can I know your name?");
  }

  function handleUserInput(userInput) {
    if (!userInput.trim()) {
      return;
    }
    appendMessage(`User: ${userInput}`);

    if (!userData.name) {
      userData.name = userInput;
      askPhoneNumber();
    } else if (!userData.phone) {
      if (isValidPhoneNumber(userInput)) {
        userData.phone = userInput;
        askEmail();
      } else {
        appendMessage("Admin: Please enter a valid phone number.");
      }
    } else if (!userData.email) {
      if (isValidEmail(userInput)) {
        userData.email = userInput;
        saveUserData();
      } else {
        appendMessage("Admin: Please enter a valid email address.");
      }
    } else {
      if (!initialMessageShown) {
        appendMessage("Admin: You can now start chatting. Type your message.");
        initialMessageShown = true;
      }
      handleUserMessage(userInput);
    }
  }

  function isValidPhoneNumber(phoneNumber) {
    // Add your phone number validation logic here
    // For example, you can use a regular expression to check the format
    const phoneRegex = /^\d{10}$/; // Assumes a 10-digit phone number
    return phoneRegex.test(phoneNumber);
  }

  function isValidEmail(email) {
    // Add your email validation logic here
    // For example, you can use a regular expression to check the format
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  }

  function askPhoneNumber() {
    appendMessage("Admin: Can I know your phone number?");
  }

  function askEmail() {
    appendMessage("Admin: Can I know your email?");
  }

  function saveUserData() {
    localStorage.setItem("userData", JSON.stringify(userData));

    fetch("process.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `name=${userData.name}&phone=${userData.phone}&email=${userData.email}`,
    })
      .then((response) => response.text())
      .then((data) => {
        console.log("Server Response:", data);

        try {
          const responseData = JSON.parse(data);

          if (responseData.hasOwnProperty("userId")) {
            const userId = parseInt(responseData.userId);

            if (!isNaN(userId)) {
              localStorage.setItem("userId", userId);
              console.log("User ID stored in local storage:", userId);

              fetchAndDisplayMessages();
            } else {
              console.error("Invalid user ID received from the server.");
            }
          } else {
            console.error("User ID not found in the server response.");
          }
        } catch (error) {
          console.error("Error parsing server response:", error);
        }
      })
      .catch((error) => console.error("Error saving user data:", error));
  }

  function handleUserMessage(userMessage) {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("User ID not found.");
      return;
    }

    fetch("storeUserMsg.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `userId=${userId}&message=${userMessage}`,
    })
      .then((response) => response.text())
      .then((data) => {
        console.log("Server Response for storing user message:", data);

        fetchAndDisplayMessages();

        scrollToBottom();
      })
      .catch((error) => console.error("Error storing user message:", error));
  }

  function scrollToBottom() {
    const chatBox = document.getElementById("chat-box");
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function fetchAndDisplayMessages() {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("User ID not found.");
      return;
    }

    fetch("getMessages.php?userId=" + userId)
      .then((response) => response.json())
      .then((data) => {
        const chatBox = document.getElementById("chat-box");
        chatBox.innerHTML = "";

        data.forEach((message) => {
          appendMessage(`${message.sender}: ${message.message}`);
        });

        if (!initialMessageShown) {
          appendMessage(
            "Admin: You can now start chatting. Type your message."
          );
          initialMessageShown = true;
        }

        scrollToBottom();
      })

      .catch((error) => console.error("Error fetching messages:", error));
  }

  function appendMessage(message) {
    const chatBox = document.getElementById("chat-box");
    const newMessage = document.createElement("div");
    newMessage.className = "chat-message";
    newMessage.textContent = message;
    newMessage.style.overflowWrap = "break-word";
    newMessage.style.gap = "10px";

    chatBox.appendChild(newMessage);
  }

  function clearLocalStorage() {
    // Clear user data and user ID from local storage
    localStorage.removeItem("userData");
    localStorage.removeItem("userId");
    alert("Local storage has been cleared.");
  }

  var fileAttach = document.getElementById("attach-file-button");
  fileAttach.addEventListener("click", function () {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);
    fileInput.click();

    fileInput.addEventListener("change", function () {
      handleFileSelection({ target: fileInput });
      document.body.removeChild(fileInput);
    });
  });

  function handleFileSelection(event) {
    const fileInput = event.target;
    const selectedFile = fileInput.files[0];

    if (selectedFile) {
      // Check if the file type is supported
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "application/pdf",
        "application/zip",
      ];
      if (allowedTypes.includes(selectedFile.type)) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const fileContent = e.target.result;
          // Handle the file content as needed (e.g., display image, parse PDF, etc.)
          alert("File attached: " + selectedFile.name);
        };
        // Read the file content based on its type
        if (selectedFile.type.startsWith("image/")) {
          reader.readAsDataURL(selectedFile); // Displaying image
        } else {
          reader.readAsText(selectedFile); // Reading other file types as text
        }
      } else {
        createPopupSquare("Unsupported file type. Please select a valid file.");
      }
    } else {
      createPopupSquare("Please select a file");
    }
  }
  setInterval(fetchMessages, 4000);
});

function scrollToBottom() {
  const chatBox = document.getElementById("chat-box");
  chatBox.scrollTop = chatBox.scrollHeight;
}

function toggleChat() {
  var chatContainer = document.getElementById("chat-container");
  chatContainer.style.display =
    chatContainer.style.display === "none" ? "block" : "none";
}

function toggleChat() {
  var chatContainer = document.getElementById("chat-container");
  chatContainer.style.display =
    chatContainer.style.display === "none" ? "block" : "none";
}
