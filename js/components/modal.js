export function openModal(overlayElement) {
  overlayElement.classList.add("is-open");
  overlayElement.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  const focusable = overlayElement.querySelector("button, input, textarea, select, a[href]");
  if (focusable) focusable.focus();
}

export function closeModal(overlayElement) {
  overlayElement.classList.remove("is-open");
  overlayElement.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

export function initModalDismissal(overlayElement) {
  overlayElement.addEventListener("click", (event) => {
    if (event.target === overlayElement) closeModal(overlayElement);
  });

  overlayElement.querySelectorAll("[data-modal-close]").forEach((btn) => {
    btn.addEventListener("click", () => closeModal(overlayElement));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlayElement.classList.contains("is-open")) {
      closeModal(overlayElement);
    }
  });
}

