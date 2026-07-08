import { formatCount } from "../utils/format.js";
import { showToast } from "./toast.js";

function updateCarousel(carousel, newIndex) {
  const card = carousel.closest(".post-card");
  const slides = carousel.querySelectorAll(".carousel-slide");
  const dots = carousel.querySelectorAll(".carousel-dot");
  const total = slides.length;
  const clampedIndex = (newIndex + total) % total;

  slides.forEach((slide, i) => slide.classList.toggle("is-active", i === clampedIndex));
  dots.forEach((dot, i) => dot.classList.toggle("is-active", i === clampedIndex));
  card.dataset.currentSlide = String(clampedIndex);
}

function handleLikeToggle(button) {
  const card = button.closest(".post-card");
  const countEl = card.querySelector("[data-like-count]");
  const isLiked = button.getAttribute("aria-pressed") === "true";
  const nextLiked = !isLiked;
  const currentCount = parseInt(button.dataset.rawLikes || countEl.textContent.replace(/[^\d]/g, ""), 10) || 0;
  const nextCount = nextLiked ? currentCount + 1 : Math.max(currentCount - 1, 0);

  button.setAttribute("aria-pressed", String(nextLiked));
  button.classList.toggle("is-active", nextLiked);
  button.dataset.rawLikes = String(nextCount);
  button.querySelector("svg").setAttribute("fill", nextLiked ? "currentColor" : "none");
  countEl.textContent = `${formatCount(nextCount)} likes`;
  card.classList.toggle("just-liked", nextLiked);
}

function handleBookmarkToggle(button) {
  const isBookmarked = button.getAttribute("aria-pressed") === "true";
  const nextBookmarked = !isBookmarked;
  button.setAttribute("aria-pressed", String(nextBookmarked));
  button.classList.toggle("is-active", nextBookmarked);
  button.querySelector("svg").setAttribute("fill", nextBookmarked ? "currentColor" : "none");
  showToast({
    type: "success",
    title: nextBookmarked ? "Saved to bookmarks" : "Removed from bookmarks",
  });
}

export function initFeedInteractions(root) {
  root.addEventListener("click", (event) => {
    const likeBtn = event.target.closest("[data-like-btn]");
    if (likeBtn) {
      handleLikeToggle(likeBtn);
      return;
    }

    const bookmarkBtn = event.target.closest("[data-bookmark-btn]");
    if (bookmarkBtn) {
      handleBookmarkToggle(bookmarkBtn);
      return;
    }

    const shareBtn = event.target.closest("[data-share-btn]");
    if (shareBtn) {
      showToast({ type: "info", title: "Share link copied", message: "Ready to paste anywhere." });
      return;
    }

    const commentBtn = event.target.closest("[data-comment-btn]");
    if (commentBtn) {
      showToast({ type: "info", title: "Comments", message: "Opening comment thread." });
      return;
    }

    const menuBtn = event.target.closest("[data-post-menu]");
    if (menuBtn) {
      showToast({ type: "info", title: "Post options", message: "Report, mute, or copy link." });
      return;
    }

    const nextArrow = event.target.closest("[data-carousel-next]");
    if (nextArrow) {
      const carousel = nextArrow.closest("[data-carousel]");
      const card = carousel.closest(".post-card");
      updateCarousel(carousel, parseInt(card.dataset.currentSlide, 10) + 1);
      return;
    }

    const prevArrow = event.target.closest("[data-carousel-prev]");
    if (prevArrow) {
      const carousel = prevArrow.closest("[data-carousel]");
      const card = carousel.closest(".post-card");
      updateCarousel(carousel, parseInt(card.dataset.currentSlide, 10) - 1);
      return;
    }

    const dot = event.target.closest(".carousel-dot");
    if (dot) {
      const carousel = dot.closest("[data-carousel]");
      const dots = Array.from(carousel.querySelectorAll(".carousel-dot"));
      updateCarousel(carousel, dots.indexOf(dot));
    }
  });

  root.addEventListener("dblclick", (event) => {
    const image = event.target.closest(".carousel-slide");
    if (!image) return;
    const card = image.closest(".post-card");
    const likeBtn = card.querySelector("[data-like-btn]");
    if (likeBtn.getAttribute("aria-pressed") !== "true") {
      handleLikeToggle(likeBtn);
    }
  });
}

