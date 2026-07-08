export function renderStoriesRail(stories) {
  return stories
    .map((story) => {
      if (story.isOwn) {
        return `
          <li class="story-item">
            <button type="button" class="story-avatar-btn" data-story-id="${story.id}" aria-label="Add to your story">
              <span class="story-ring story-ring--own">
                <img class="avatar avatar-md avatar-ring-inner" src="${story.user.avatar}" alt="">
                <span class="story-add-icon" aria-hidden="true">+</span>
              </span>
              <span class="story-label">Your story</span>
            </button>
          </li>
        `;
      }

      return `
        <li class="story-item">
          <button type="button" class="story-avatar-btn" data-story-id="${story.id}" aria-label="View ${story.user.name}'s story">
            <span class="story-ring${story.viewed ? " is-viewed" : ""}">
              <img class="avatar avatar-md avatar-ring-inner" src="${story.user.avatar}" alt="">
            </span>
            <span class="story-label">${story.user.handle}</span>
          </button>
        </li>
      `;
    })
    .join("");
}

