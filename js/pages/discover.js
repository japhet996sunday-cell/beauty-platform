import { generatePostBatch, generateDiscoverUsers } from "../utils/mockData.js";
import { debounce } from "../utils/debounce.js";
import { initFollowButtons } from "../components/followButton.js";
import { formatCount } from "../utils/format.js";

function renderMasonryItem(post) {
  return `
    <div class="masonry-item">
      <img src="${post.images[0]}" alt="${post.caption}" loading="lazy">
      <div class="masonry-item-overlay">
        <span>❤ ${formatCount(post.likes)}</span>
        <span>💬 ${formatCount(post.comments)}</span>
      </div>
    </div>
  `;
}

function renderPeopleCard(user) {
  return `
    <div class="card people-card">
      <img class="avatar avatar-lg" src="${user.avatar}" alt="">
      <strong>${user.name}</strong>
      <span style="font-size: var(--fs-xs); color: var(--color-muted);">@${user.handle}</span>
      <p class="people-card-bio">${formatCount(user.followers)} followers</p>
      <button type="button" class="btn ${user.isFollowing ? "btn-outline" : "btn-primary"}" data-follow-btn data-following="${user.isFollowing}" data-username="${user.name}">
        ${user.isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  `;
}

function renderEmptyState(container, query) {
  container.innerHTML = `
    <div class="state-panel" style="grid-column: 1 / -1;">
      <div class="state-icon" aria-hidden="true">🔍</div>
      <h3 class="state-title">No results for "${query}"</h3>
      <p class="state-message">Try a different search term, or browse categories using the filters above.</p>
    </div>
  `;
}

function initTabs() {
  const tabs = document.querySelectorAll("[data-tab]");
  const panels = document.querySelectorAll("[data-panel]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");

      panels.forEach((panel) => {
        panel.hidden = panel.dataset.panel !== tab.dataset.tab;
      });
    });
  });
}

function initFilterChips() {
  const chips = document.querySelectorAll(".filter-chip");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
    });
  });
}

function initSearch(allPosts, masonryGrid) {
  const input = document.getElementById("discover-search-input");
  if (!input) return;

  const handleSearch = debounce((value) => {
    const query = value.trim().toLowerCase();
    if (query.length === 0) {
      masonryGrid.innerHTML = allPosts.map(renderMasonryItem).join("");
      return;
    }

    const matches = allPosts.filter(
      (post) =>
        post.caption.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        post.user.name.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      renderEmptyState(masonryGrid, value.trim());
    } else {
      masonryGrid.innerHTML = matches.map(renderMasonryItem).join("");
    }
  }, 300);

  input.addEventListener("input", (event) => handleSearch(event.target.value));
}

document.addEventListener("DOMContentLoaded", () => {
  const masonryGrid = document.querySelector("[data-masonry-grid]");
  const peopleGrid = document.querySelector("[data-people-grid]");

  const posts = generatePostBatch(0, 24);
  const users = generateDiscoverUsers(12);

  masonryGrid.innerHTML = posts.map(renderMasonryItem).join("");
  peopleGrid.innerHTML = users.map(renderPeopleCard).join("");

  initTabs();
  initFilterChips();
  initSearch(posts, masonryGrid);
  initFollowButtons(peopleGrid);
});

