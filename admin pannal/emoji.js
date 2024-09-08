document.addEventListener("DOMContentLoaded", function () {
  const emojiButton = document.getElementById("emoji-button");
  const emojiModal = document.getElementById("emoji-modal");
  const emojiListContainer = document.getElementById("emoji-list");
  const closeButton = document.querySelector(".close");
  const adminMessageInput = document.getElementById("admin-message-input");

  if (emojiButton && emojiModal && emojiListContainer && closeButton) {
    emojiButton.addEventListener('click', openEmojiModal);

    const emojiList = ['😊', '😎', '👍', '❤️', '🎉', '🙌', '🤔', '🚀', '👋'];
    emojiList.forEach(emoji => {
      const emojiItem = document.createElement('span');
      emojiItem.className = 'emoji-item';
      emojiItem.textContent = emoji;
      emojiItem.addEventListener('click', () => selectEmoji(emoji));
      emojiListContainer.appendChild(emojiItem);
    });

    closeButton.addEventListener('click', closeEmojiModal);
  } else {
    console.error("Emoji modal or buttons not found");
  }

  function openEmojiModal() {
    emojiModal.style.display = "block";
  }

  function closeEmojiModal() {
    emojiModal.style.display = "none";
  }

  function selectEmoji(emoji) {
    if (adminMessageInput) {
      adminMessageInput.value += emoji;
      closeEmojiModal();
    } else {
      console.error("Admin message input not found for emoji selection");
    }
  }
});
