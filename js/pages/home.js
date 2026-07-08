import { generatePostBatch, generateStories, generateDiscoverUsers } from "../utils/mockData.js";
import { renderPostCard, renderPostSkeleton } from "../components/postCard.js";
import { renderStoriesRail } from "../components/stories.js";
import { initFeedInteractions } from "../components/feedInteractions.js";
import { initInfiniteScroll } from "../utils/infiniteScroll.js";
import { initStoryViewer } from "../components/storyViewer.js";
import { initFollowButtons } from "../components/followButton.js";
import { formatCount } from "../utils/format.js";

const POSTS_PER_PAGE = 4;
const MAX_POSTS = 40;

function renderSuggestions(container) {
  const users = generateDiscoverUsers(5);
  container.innerHTML = users
    .map(
      (user) => `
        <div class="suggestion-item">
          <img class="avatar avatar-sm" src="${user.avatar}" alt="">
          <div class="suggestion-item-meta">
            <strong>${user.name}</strong>
            <span>${formatCount(user.followers)} followers</span>
          </div>
          <button type="button" class="btn btn-sm ${user.isFollowing ? "btn-outline" : "btn-primary"}" data-follow-btn data-following="${user.isFollowing}" data-username="${user.name}">
            ${user.isFollowing ? "Following" : "Follow"}
          </button>
        </div>
      `
    )
    .join("");
}

function initFeed() {
  const feedContainer = document.querySelector("[data-feed-container]");
  const sentinel = document.querySelector("[data-feed-sentinel]");
  let loadedCount = 0;

  function loadNextPage() {
    if (loadedCount >= MAX_POSTS) {
      observer.unobserve(sentinel);
      return Promise.resolve();
    }

    const skeletonWrap = document.createElement("div");
    skeletonWrap.innerHTML = renderPostSkeleton().repeat(2);
    feedContainer.appendChild(skeletonWrap);

    return new Promise((resolve) => {
      setTimeout(() => {
        skeletonWrap.remove();
        const posts = generatePostBatch(loadedCount, POSTS_PER_PAGE);
        const wrap = document.createElement("div");
        wrap.innerHTML = posts.map(renderPostCard).join("");
        Array.from(wrap.children).forEach((child) => feedContainer.appendChild(child));
        loadedCount += POSTS_PER_PAGE;
        resolve();
      }, 700);
    });
  }

  const observer = initInfiniteScroll({ sentinel, onLoadMore: loadNextPage });
  loadNextPage();
}

document.addEventListener("DOMContentLoaded", () => {
  const storiesRail = document.querySelector("[data-stories-rail]");
  const stories = generateStories();
  if (storiesRail) {
    storiesRail.innerHTML = renderStoriesRail(stories);
    initStoryViewer(stories);
  }

  const suggestionsList = document.querySelector("[data-suggestions-list]");
  if (suggestionsList) {
    renderSuggestions(suggestionsList);
    initFollowButtons(suggestionsList);
  }

  initFeed();
  initFeedInteractions(document.body);
});

