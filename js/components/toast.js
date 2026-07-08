const ICONS = {
  success: "✓",
  error: "!",
  info: "i",
};

let region = null;

function getRegion() {
  if (region) return region;
  region = document.querySelector(".toast-region");
  if (!region) {
    region = document.createElement("div");
    region.className = "toast-region";
    region.setAttribute("role", "status");
    region.setAttribute("aria-live", "polite");
    document.body.appendChild(region);
  }
  return region;
}

export function showToast({ type = "info", title, message, duration = 4000 }) {
  const container = getRegion();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <span class="toast-icon ${type}" aria-hidden="true">${ICONS[type] || ICONS.info}</span>
    <div class="toast-body">
      <p class="toast-title">${title}</p>
      ${message ? `<p class="toast-message">${message}</p>` : ""}
    </div>
  `;
  container.appendChild(toast);

  const remove = () => {
    toast.classList.add("is-leaving");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
  };

  const timer = setTimeout(remove, duration);
  toast.addEventListener("click", () => {
    clearTimeout(timer);
    remove();
  });

  return toast;
}

