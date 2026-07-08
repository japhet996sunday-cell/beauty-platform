import { showToast } from "./toast.js";

export function initFollowButtons(root) {
  root.addEventListener("click", (event) => {
    const button = event.target.closest("[data-follow-btn]");
    if (!button) return;

    const isFollowing = button.dataset.following === "true";
    const nextFollowing = !isFollowing;
    const username = button.dataset.username || "this user";

    button.dataset.following = String(nextFollowing);
    button.textContent = nextFollowing ? "Following" : "Follow";
    button.classList.toggle("btn-outline", nextFollowing);
    button.classList.toggle("btn-primary", !nextFollowing);

    showToast({
      type: "success",
      title: nextFollowing ? `Following ${username}` : `Unfollowed ${username}`,
    });
  });
}

