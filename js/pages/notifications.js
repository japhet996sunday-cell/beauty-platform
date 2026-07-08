import { generateNotifications } from "../utils/mockData.js";
import { initFollowButtons } from "../components/followButton.js";
import { showToast } from "../components/toast.js";

const TYPE_ICON = {
  like: "❤",
  comment: "💬",
  follow: "＋",
  mention: "@",
};

function renderNotification(notif) {
  const actionSlot =
    notif.type === "follow"
      ? `<button type="button" class="btn btn-sm btn-primary" data-follow-btn data-following="false" data-username="${notif.user.name}">Follow back</button>`
      : notif.thumbnail
        ? `<img class="notification-thumb" src="${notif.thumbnail}" alt="" loading="lazy">`
        : "";

  return `
    <div class="notification-item${notif.isUnread ? " is-unread" : ""}" data-notification-id="${notif.id}" data-notification-type="${notif.type}">
      <div class="notification-icon-wrap">
        <img class="avatar avatar-md" src="${notif.user.avatar}" alt="" loading="lazy">
        <span class="notification-type-icon ${notif.type}" aria-hidden="true">${TYPE_ICON[notif.type]}</span>
      </div>
      <div class="notification-content">
        <span><strong>${notif.user.name}</strong> ${notif.text}</span>
        <span class="notification-time">${notif.timeLabel}</span>
      </div>
      ${actionSlot}
    </div>
  `;
}

function renderGroupedList(notifications, container) {
  if (notifications.length === 0) {
    container.innerHTML = `
      <div class="state-panel">
        <div class="state-icon" aria-hidden="true">🔔</div>
        <h3 class="state-title">You're all caught up</h3>
        <p class="state-message">No notifications in this category right now.</p>
      </div>
    `;
    return;
  }

  const groups = new Map();
  notifications.forEach((notif) => {
    if (!groups.has(notif.group)) groups.set(notif.group, []);
    groups.get(notif.group).push(notif);
  });

  let html = "";
  groups.forEach((items, groupName) => {
    html += `<h2 class="notification-group-label">${groupName}</h2>`;
    html += items.map(renderNotification).join("");
  });

  container.innerHTML = html;
}

function initFilters(allNotifications, container) {
  const tabs = document.querySelectorAll("[data-notif-filter]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");

      const filter = tab.dataset.notifFilter;
      const filtered = filter === "all" ? allNotifications : allNotifications.filter((n) => n.type === filter);
      renderGroupedList(filtered, container);
    });
  });
}

function initMarkAllRead(container) {
  document.querySelector("[data-mark-all-read]")?.addEventListener("click", () => {
    container.querySelectorAll(".notification-item.is-unread").forEach((item) => item.classList.remove("is-unread"));
    showToast({ type: "success", title: "All notifications marked as read" });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("[data-notifications-list]");
  const notifications = generateNotifications(18);

  renderGroupedList(notifications, container);
  initFilters(notifications, container);
  initFollowButtons(container);
  initMarkAllRead(container);
});
 
