import { generateConversations, generateChatMessages } from "../utils/mockData.js";

function renderConversationItem(convo) {
  return `
    <button type="button" class="conversation-item" data-conversation-id="${convo.id}">
      <div class="conversation-avatar-wrap">
        <img class="avatar avatar-md" src="${convo.user.avatar}" alt="" loading="lazy">
        ${convo.isOnline ? '<span class="online-dot"></span>' : ""}
      </div>
      <div class="conversation-meta">
        <div class="conversation-name-row">
          <strong>${convo.user.name}</strong>
          <span class="conversation-time">${convo.lastMessageTime}</span>
        </div>
        <span class="conversation-preview${convo.unreadCount > 0 ? " is-unread" : ""}">${convo.lastMessage}</span>
      </div>
      ${convo.unreadCount > 0 ? '<span class="unread-dot"></span>' : ""}
    </button>
  `;
}

function renderMessageBubble(message) {
  return `
    <div class="message-row${message.isOwn ? " is-own" : ""}">
      <div class="message-bubble">
        ${message.text}
        <span class="message-time">${message.time}</span>
      </div>
    </div>
  `;
}

function renderTypingIndicator() {
  return `
    <div class="message-row">
      <div class="typing-indicator">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    </div>
  `;
}

function initConversationList(conversations, onSelect) {
  const listEl = document.querySelector("[data-conversation-list]");
  listEl.innerHTML = conversations.map(renderConversationItem).join("");

  listEl.addEventListener("click", (event) => {
    const item = event.target.closest("[data-conversation-id]");
    if (!item) return;

    listEl.querySelectorAll(".conversation-item").forEach((el) => el.classList.remove("is-active"));
    item.classList.add("is-active");

    const preview = item.querySelector(".conversation-preview");
    preview?.classList.remove("is-unread");
    item.querySelector(".unread-dot")?.remove();

    onSelect(item.dataset.conversationId);
  });
}

function initSearchFilter(conversations) {
  const input = document.querySelector("[data-conversation-search]");
  const listEl = document.querySelector("[data-conversation-list]");

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    const filtered = query.length === 0
      ? conversations
      : conversations.filter((c) => c.user.name.toLowerCase().includes(query));

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="state-panel">
          <div class="state-icon" aria-hidden="true">💬</div>
          <h3 class="state-title">No conversations found</h3>
          <p class="state-message">Try searching a different name.</p>
        </div>
      `;
    } else {
      listEl.innerHTML = filtered.map(renderConversationItem).join("");
    }
  });
}

function openConversation(conversation, panels) {
  const { avatarEl, onlineDotEl, nameEl, statusEl, messagesEl } = panels;

  avatarEl.src = conversation.user.avatar;
  avatarEl.alt = conversation.user.name;
  nameEl.textContent = conversation.user.name;
  statusEl.textContent = conversation.isOnline ? "Active now" : "Offline";
  onlineDotEl.hidden = !conversation.isOnline;

  const messages = generateChatMessages(conversation.id, 12);
  messagesEl.innerHTML = messages.map(renderMessageBubble).join("");
  messagesEl.scrollTop = messagesEl.scrollHeight;

  if (conversation.isOnline) {
    setTimeout(() => {
      messagesEl.insertAdjacentHTML("beforeend", renderTypingIndicator());
      messagesEl.scrollTop = messagesEl.scrollHeight;

      setTimeout(() => {
        messagesEl.querySelector(".typing-indicator")?.closest(".message-row")?.remove();
        messagesEl.insertAdjacentHTML(
          "beforeend",
          renderMessageBubble({ text: "Just sent you the link — let me know what you think!", isOwn: false, time: "now" })
        );
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }, 2200);
    }, 1200);
  }
}

function initChatForm(messagesEl) {
  const form = document.querySelector("[data-chat-form]");
  const input = document.querySelector("[data-chat-input]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (text.length === 0) return;

    messagesEl.insertAdjacentHTML("beforeend", renderMessageBubble({ text, isOwn: true, time: "now" }));
    messagesEl.scrollTop = messagesEl.scrollHeight;
    input.value = "";
  });
}

function initMobileNavigation() {
  const conversationPanel = document.querySelector("[data-conversation-panel]");
  const chatPanel = document.querySelector("[data-chat-panel]");
  const backBtn = document.querySelector("[data-chat-back]");
  const isMobile = () => window.innerWidth < 768;

  document.querySelector("[data-conversation-list]").addEventListener("click", (event) => {
    if (!event.target.closest("[data-conversation-id]")) return;
    if (!isMobile()) return;
    conversationPanel.classList.add("is-hidden-mobile");
    chatPanel.classList.remove("is-hidden-mobile");
  });

  backBtn.addEventListener("click", () => {
    chatPanel.classList.add("is-hidden-mobile");
    conversationPanel.classList.remove("is-hidden-mobile");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const conversations = generateConversations(10);

  const panels = {
    avatarEl: document.querySelector("[data-chat-avatar]"),
    onlineDotEl: document.querySelector("[data-chat-online-dot]"),
    nameEl: document.querySelector("[data-chat-name]"),
    statusEl: document.querySelector("[data-chat-status]"),
    messagesEl: document.querySelector("[data-chat-messages]"),
  };

  function selectConversation(id) {
    const conversation = conversations.find((c) => c.id === id);
    if (conversation) openConversation(conversation, panels);
  }

  initConversationList(conversations, selectConversation);
  initSearchFilter(conversations);
  initChatForm(panels.messagesEl);
  initMobileNavigation();

  selectConversation(conversations[0].id);
  document.querySelector(`[data-conversation-id="${conversations[0].id}"]`)?.classList.add("is-active");
});

