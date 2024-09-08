document.addEventListener("DOMContentLoaded", function () {
   
    const emojiList = ['😊', '😎', '👍', '❤️', '🎉', '🙌', '🤔', '🚀', '👋'];
  
    // Add event listener to emoji button
    const emojiButton = document.getElementById("emoji-button");
    emojiButton.addEventListener('click', openEmojiModal);
  
    // Initialize EmojiButton
    const emojiModal = document.getElementById("emoji-modal");
    const emojiListContainer = document.getElementById("emoji-list");
  
    emojiList.forEach(emoji => {
      const emojiItem = document.createElement('span');
      emojiItem.className = 'emoji-item';
      emojiItem.textContent = emoji;
      emojiItem.addEventListener('click', () => selectEmoji(emoji));
      emojiListContainer.appendChild(emojiItem);
    });
  
    // Handle modal close button
    const closeButton = document.querySelector(".close");
    closeButton.addEventListener('click', closeEmojiModal);
  
    function openEmojiModal() {
      emojiModal.style.display = "block";
    }
  
    function closeEmojiModal() {
      emojiModal.style.display = "none";
    }
  
    function selectEmoji(emoji) {
      const chatInput = document.getElementById("user-input");
      chatInput.value += emoji;
      closeEmojiModal();
    }
  
    // ... rest of the code ...
  });
  