import { formatCount } from "../utils/format.js";

export function renderPostCard(post) {
  const carouselSlides = post.images
    .map((src, i) => `<img src="${src}" alt="Post image ${i + 1} of ${post.images.length} by ${post.user.name}" loading="lazy" class="carousel-slide${i === 0 ? " is-active" : ""}">`)
    .join("");

  const carouselDots = post.images.length > 1
    ? `<div class="carousel-dots">${post.images.map((_, i) => `<span class="carousel-dot${i === 0 ? " is-active" : ""}"></span>`).join("")}</div>`
    : "";

  const carouselArrows = post.images.length > 1
    ? `
      <button type="button" class="carousel-arrow carousel-arrow--prev" data-carousel-prev aria-label="Previous image">‹</button>
      <button type="button" class="carousel-arrow carousel-arrow--next" data-carousel-next aria-label="Next image">›</button>
    `
    : "";

  const tagsHtml = post.tags.map((tag) => `<span class="post-tag">${tag}</span>`).join("");

  return `
    <article class="card post-card" data-post-id="${post.id}" data-image-count="${post.images.length}" data-current-slide="0">
      <header class="post-card-header">
        <a href="profile.html" class="post-card-user">
          <img class="avatar avatar-md" src="${post.user.avatar}" alt="" loading="lazy">
          <span class="post-card-user-meta">
            <span class="post-card-username">${post.user.name}${post.user.verified ? '<span class="verified-badge" title="Verified" aria-label="Verified">✓</span>' : ""}</span>
            <span class="post-card-timestamp">${post.timestamp}</span>
          </span>
        </a>
        <button type="button" class="nav-icon-btn" data-post-menu aria-label="More options">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
        </button>
      </header>

      <div class="post-carousel" data-carousel>
        <div class="post-carousel-track">${carouselSlides}</div>
        ${carouselArrows}
        ${carouselDots}
      </div>

      <div class="post-card-actions">
        <div class="post-card-actions-left">
          <button type="button" class="post-action-btn${post.isLiked ? " is-active" : ""}" data-like-btn aria-pressed="${post.isLiked}" aria-label="Like post">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="${post.isLiked ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.6Z"/></svg>
          </button>
          <button type="button" class="post-action-btn" data-comment-btn aria-label="View comments">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          </button>
          <button type="button" class="post-action-btn" data-share-btn aria-label="Share post">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13"/></svg>
          </button>
        </div>
        <button type="button" class="post-action-btn${post.isBookmarked ? " is-active" : ""}" data-bookmark-btn aria-pressed="${post.isBookmarked}" aria-label="Bookmark post">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="${post.isBookmarked ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 21 12 16l-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
        </button>
      </div>

      <div class="post-card-body">
        <p class="post-like-count" data-like-count>${formatCount(post.likes)} likes</p>
        <p class="post-caption"><strong>${post.user.name}</strong> ${post.caption}</p>
        <p class="post-tags">${tagsHtml}</p>
        <button type="button" class="post-comment-preview" data-comment-btn>
          View all ${formatCount(post.comments)} comments
        </button>
        <p class="post-top-comment"><strong>${post.topComment.user}</strong> ${post.topComment.text}</p>
      </div>
    </article>
  `;
}

export function renderPostSkeleton() {
  return `
    <div class="card post-card post-skeleton" aria-hidden="true">
      <div class="post-card-header">
        <div class="flex gap-3" style="align-items:center;">
          <span class="skeleton skeleton-avatar"></span>
          <span class="skeleton skeleton-line" style="width:120px;"></span>
        </div>
      </div>
      <span class="skeleton" style="display:block; width:100%; aspect-ratio: 1; border-radius:0;"></span>
      <div class="post-card-body">
        <span class="skeleton skeleton-line" style="width:60px; margin-bottom: var(--space-3);"></span>
        <span class="skeleton skeleton-line" style="width:90%; margin-bottom: var(--space-2);"></span>
        <span class="skeleton skeleton-line" style="width:70%;"></span>
      </div>
    </div>
  `;
}

