import { showToast } from "../components/toast.js";

const MAX_IMAGES = 5;
const MAX_CHARS = 500;

function initDropzone(state, renderPreviews) {
  const dropzone = document.querySelector("[data-dropzone]");
  const fileInput = document.querySelector("[data-file-input]");

  function handleFiles(fileList) {
    const files = Array.from(fileList).slice(0, MAX_IMAGES - state.images.length);
    if (files.length === 0) return;

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        state.images.push({ src: reader.result, name: file.name });
        renderPreviews();
      };
      reader.readAsDataURL(file);
    });
  }

  fileInput.addEventListener("change", (event) => {
    handleFiles(event.target.files);
    fileInput.value = "";
  });

  dropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropzone.classList.add("is-dragover");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("is-dragover");
  });

  dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropzone.classList.remove("is-dragover");
    if (event.dataTransfer?.files) handleFiles(event.dataTransfer.files);
  });

  dropzone.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      fileInput.click();
    }
  });
}

function updatePublishState(state) {
  const buttons = document.querySelectorAll("[data-publish-btn], [data-submit-btn]");
  const canPublish = state.images.length > 0;
  buttons.forEach((btn) => {
    btn.disabled = !canPublish;
  });
}

function renderImagePreviews(state) {
  const grid = document.querySelector("[data-preview-grid]");
  grid.hidden = state.images.length === 0;

  const tiles = state.images
    .map(
      (image, index) => `
        <div class="image-preview-item">
          <img src="${image.src}" alt="Upload preview ${index + 1}">
          ${index === 0 ? '<span class="image-preview-cover-badge">Cover</span>' : ""}
          <button type="button" class="image-preview-remove" data-remove-image="${index}" aria-label="Remove image">✕</button>
        </div>
      `
    )
    .join("");

  const addMoreTile =
    state.images.length < MAX_IMAGES
      ? `<label class="add-more-tile" for="file-input" aria-label="Add more images">+</label>`
      : "";

  grid.innerHTML = tiles + addMoreTile;
  updatePublishState(state);
}

function initRemoveHandlers(state, renderPreviews) {
  document.querySelector("[data-preview-grid]").addEventListener("click", (event) => {
    const removeBtn = event.target.closest("[data-remove-image]");
    if (!removeBtn) return;
    const index = parseInt(removeBtn.dataset.removeImage, 10);
    state.images.splice(index, 1);
    renderPreviews();
  });
}

function initCaptionCounter() {
  const input = document.querySelector("[data-caption-input]");
  const counter = document.querySelector("[data-char-count]");

  input.addEventListener("input", () => {
    const length = input.value.length;
    counter.textContent = `${length} / ${MAX_CHARS}`;
    counter.style.color = length >= MAX_CHARS ? "var(--color-danger)" : "var(--color-muted)";
  });
}

function initTagInput() {
  const row = document.querySelector("[data-tag-row]");
  const input = document.querySelector("[data-tag-input]");
  const tags = [];

  function renderTags() {
    row.querySelectorAll(".tag-chip").forEach((chip) => chip.remove());
    tags.forEach((tag, index) => {
      const chip = document.createElement("span");
      chip.className = "tag-chip";
      chip.innerHTML = `#${tag} <button type="button" data-remove-tag="${index}" aria-label="Remove tag ${tag}">✕</button>`;
      row.insertBefore(chip, input);
    });
  }

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      const value = input.value.trim().replace(/^#/, "");
      if (value.length > 0 && !tags.includes(value)) {
        tags.push(value);
        renderTags();
      }
      input.value = "";
    } else if (event.key === "Backspace" && input.value === "" && tags.length > 0) {
      tags.pop();
      renderTags();
    }
  });

  row.addEventListener("click", (event) => {
    const removeBtn = event.target.closest("[data-remove-tag]");
    if (!removeBtn) return;
    tags.splice(parseInt(removeBtn.dataset.removeTag, 10), 1);
    renderTags();
  });
}

function initPublishFlow(state) {
  const form = document.querySelector("[data-create-form]");
  const publishBtn = document.querySelector("[data-publish-btn]");
  const progressTrack = document.querySelector("[data-upload-progress]");
  const progressFill = document.querySelector("[data-upload-progress-fill]");

  function publish() {
    if (state.images.length === 0) return;

    progressTrack.hidden = false;
    progressFill.style.width = "0%";
    let progress = 0;

    const interval = setInterval(() => {
      progress += 20;
      progressFill.style.width = `${Math.min(progress, 100)}%`;
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          progressTrack.hidden = true;
          showToast({ type: "success", title: "Post shared!", message: "Your post is now live on your profile." });
          window.location.href = "profile.html";
        }, 300);
      }
    }, 200);
  }

  publishBtn.addEventListener("click", publish);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    publish();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const state = { images: [] };
  const renderPreviews = () => renderImagePreviews(state);

  initDropzone(state, renderPreviews);
  initRemoveHandlers(state, renderPreviews);
  initCaptionCounter();
  initTagInput();
  initPublishFlow(state);
});

