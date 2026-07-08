const STORY_DURATION = 5000;

function buildViewerMarkup(story) {
  return `
    <div class="story-viewer-header">
      <img class="avatar avatar-sm" src="${story.user.avatar}" alt="">
      <span class="story-viewer-username">${story.user.name}</span>
      <span class="story-viewer-time">2h</span>
      <button type="button" class="nav-icon-btn story-viewer-close" data-modal-close aria-label="Close story">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    </div>
  `;
}

export function initStoryViewer(stories) {
  const overlay = document.querySelector("[data-story-viewer]");
  if (!overlay) return;

  const progressTrack = overlay.querySelector("[data-story-progress]");
  const headerSlot = overlay.querySelector("[data-story-header]");
  const imageSlot = overlay.querySelector("[data-story-image]");
  const prevZone = overlay.querySelector("[data-story-prev-zone]");
  const nextZone = overlay.querySelector("[data-story-next-zone]");

  let activeIndex = 0;
  let timer = null;
  let viewableStories = stories.filter((s) => !s.isOwn);

  function renderProgressBars() {
    progressTrack.innerHTML = viewableStories
      .map((_, i) => `<span class="story-progress-bar"><span class="story-progress-fill" data-fill="${i}"></span></span>`)
      .join("");
  }

  function playSegment(index) {
    clearTimeout(timer);
    const fills = progressTrack.querySelectorAll(".story-progress-fill");
    fills.forEach((fill, i) => {
      fill.style.transition = "none";
      fill.style.width = i < index ? "100%" : "0%";
    });

    void progressTrack.offsetWidth;

    const currentFill = fills[index];
    if (currentFill) {
      currentFill.style.transition = `width ${STORY_DURATION}ms linear`;
      requestAnimationFrame(() => {
        currentFill.style.width = "100%";
      });
    }

    timer = setTimeout(() => goToStory(index + 1), STORY_DURATION);
  }

  function goToStory(index) {
    if (index < 0) return;
    if (index >= viewableStories.length) {
      closeViewer();
      return;
    }
    activeIndex = index;
    const story = viewableStories[activeIndex];
    headerSlot.innerHTML = buildViewerMarkup(story);
    headerSlot.querySelector("[data-modal-close]").addEventListener("click", closeViewer);
    imageSlot.style.backgroundImage = `url(${story.user.avatar})`;
    playSegment(activeIndex);
  }

  function openViewer(storyId) {
    const index = viewableStories.findIndex((s) => s.id === storyId);
    renderProgressBars();
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    goToStory(index >= 0 ? index : 0);
  }

  function closeViewer() {
    clearTimeout(timer);
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  prevZone.addEventListener("click", () => goToStory(activeIndex - 1));
  nextZone.addEventListener("click", () => goToStory(activeIndex + 1));

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeViewer();
  });

  document.addEventListener("keydown", (event) => {
    if (!overlay.classList.contains("is-open")) return;
    if (event.key === "Escape") closeViewer();
    if (event.key === "ArrowRight") goToStory(activeIndex + 1);
    if (event.key === "ArrowLeft") goToStory(activeIndex - 1);
  });

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-story-id]");
    if (!trigger) return;
    const storyId = trigger.dataset.storyId;
    const story = stories.find((s) => s.id === storyId);
    if (story && story.isOwn) return;
    openViewer(storyId);
  });
}

