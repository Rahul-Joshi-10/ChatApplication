document.addEventListener("DOMContentLoaded", function () {
  let selectedUserId; // Variable to store the selected user ID
  fetchUserList();
  
  window.addEventListener("focus", function () {
    fetchUserList();
  });

  const adminMessageInput = document.getElementById("admin-message-input");
  const sendButton = document.getElementById("send-admin-message-button");

  if (sendButton && adminMessageInput) {
    sendButton.addEventListener("click", sendAdminMessage);
  } else {
    console.error("Send button or admin message input not found");
  }

  function sendAdminMessage() {
    const adminMessage = adminMessageInput.value;
    if (!adminMessage) {
      alert("Please enter a message.");
      return;
    }

    if (!selectedUserId) {
      alert("Please select a user.");
      return;
    }

    fetch("storeAdminMsg.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `userId=${selectedUserId}&message=${adminMessage}`,
    })
      .then((response) => response.text())
      .then((data) => {
        console.log("Server Response:", data);
        fetchMessages(selectedUserId);
      })
      .catch((error) => console.error("Error sending admin message:", error));

    adminMessageInput.value = "";
  }

  function fetchUserList() {
    fetch("getUsers.php")
      .then((response) => response.json())
      .then((data) => {
        const userList = document.getElementById("user-list");
        userList.innerHTML = "";
        data.forEach((user) => {
          const listItem = document.createElement("div");
          listItem.className = "user-item";
          listItem.textContent = user.name;
          listItem.dataset.userId = user.id;
          listItem.addEventListener("click", function () {
            selectedUserId = user.id;
            fetchMessages(selectedUserId);
          });
          userList.appendChild(listItem);
        });

        if (data.length > 0) {
          selectedUserId = data[0].id;
          fetchMessages(selectedUserId);
        }
      })
      .catch((error) => console.error("Error fetching user list:", error));
  }

  function fetchMessages(userId) {
    const chatBox = document.getElementById("chat-box");
    if (chatBox) {
      fetch("getMessages.php?userId=" + (userId || selectedUserId))
        .then((response) => response.json())
        .then((data) => {
          chatBox.innerHTML = "";
          data.forEach((message) => {
            appendMessage(`${message.sender}: ${message.message}`);
          });
          scrollToBottom(chatBox);
        })
        .catch((error) => console.error("Error fetching messages:", error));
    } else {
      console.error("Chat box element not found");
    }
  }

  function appendMessage(message) {
    const chatBox = document.getElementById("chat-box");
    const newMessage = document.createElement("div");
    newMessage.className = "chat-message";
    newMessage.textContent = message;
    chatBox.appendChild(newMessage);
    scrollToBottom(chatBox);
  }

  function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
  }

  setInterval(() => {
    if (selectedUserId) {
      fetchMessages(selectedUserId);
    }
  }, 1000);
});
