import { generatePostBatch } from "../utils/mockData.js";
import { formatCount } from "../utils/format.js";
import { openModal, closeModal, initModalDismissal } from "../components/modal.js";
import { showToast } from "../components/toast.js";

function renderGallery(posts, container, isListView) {
  container.classList.toggle("is-list-view", isListView);

  if (posts.length === 0) {
    container.innerHTML = `
      <div class="state-panel" style="grid-column: 1 / -1;">
        <div class="state-icon" aria-hidden="true">📷</div>
        <h3 class="state-title">No posts yet</h3>
        <p class="state-message">Posts shared to this profile will appear here.</p>
      </div>
    `;
    return;
  }

  if (isListView) {
    container.innerHTML = posts
      .map(
        (post) => `
          <div class="card gallery-item">
            <img src="${post.images[0]}" alt="${post.caption}" loading="lazy">
            <div class="profile-list-caption">
              <p class="post-caption">${post.caption}</p>
              <p class="mt-2" style="font-size: var(--fs-xs); color: var(--color-muted);">❤ ${formatCount(post.likes)} · 💬 ${formatCount(post.comments)}</p>
            </div>
          </div>
        `
      )
      .join("");
    return;
  }

  container.innerHTML = posts
    .map(
      (post) => `
        <div class="gallery-item">
          <img src="${post.images[0]}" alt="${post.caption}" loading="lazy">
          <div class="gallery-item-overlay">
            <span>❤ ${formatCount(post.likes)}</span>
            <span>💬 ${formatCount(post.comments)}</span>
          </div>
        </div>
      `
    )
    .join("");
}

function initTabsAndView(allPosts, savedPosts, gallery) {
  const tabs = document.querySelectorAll("[data-profile-tab]");
  const viewButtons = document.querySelectorAll("[data-view]");
  let activeTab = "posts";
  let activeView = "grid";

  function update() {
    const posts = activeTab === "posts" ? allPosts : savedPosts;
    renderGallery(posts, gallery, activeView === "list");
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      activeTab = tab.dataset.profileTab;
      update();
    });
  });

  viewButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      viewButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      activeView = btn.dataset.view;
      update();
    });
  });

  update();
}

function initEditProfileModal() {
  const modal = document.querySelector("[data-edit-profile-modal]");
  const openTriggers = document.querySelectorAll("[data-open-edit-profile]");
  const saveBtn = document.querySelector("[data-save-profile]");
  if (!modal) return;

  initModalDismissal(modal);
  openTriggers.forEach((trigger) => trigger.addEventListener("click", () => openModal(modal)));

  saveBtn?.addEventListener("click", () => {
    closeModal(modal);
    showToast({ type: "success", title: "Profile updated", message: "Your changes have been saved." });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector("[data-profile-gallery]");
  const allPosts = generatePostBatch(0, 12);
  const savedPosts = generatePostBatch(30, 5);

  initTabsAndView(allPosts, savedPosts, gallery);
  initEditProfileModal();
});

