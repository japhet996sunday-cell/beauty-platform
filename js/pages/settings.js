import { setThemePreference, getThemePreference } from "../utils/theme.js";
import { openModal, closeModal, initModalDismissal } from "../components/modal.js";
import { showToast } from "../components/toast.js";

const SETTINGS_STORAGE_KEY = "lumiere-settings";

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveSetting(key, value) {
  const settings = loadSettings();
  settings[key] = value;
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

function initThemeOptions() {
  const buttons = document.querySelectorAll("[data-theme-option]");
  const current = getThemePreference();

  buttons.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.themeOption === current);
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      setThemePreference(btn.dataset.themeOption);
      showToast({ type: "success", title: "Theme updated" });
    });
  });
}

function initToggleSettings() {
  const settings = loadSettings();

  document.querySelectorAll("[data-setting]").forEach((input) => {
    const key = input.dataset.setting;

    if (input.type === "checkbox" && key in settings) {
      input.checked = settings[key];
    } else if (input.tagName === "SELECT" && key in settings) {
      input.value = settings[key];
    }

    const eventName = input.tagName === "SELECT" ? "change" : "change";
    input.addEventListener(eventName, () => {
      const value = input.type === "checkbox" ? input.checked : input.value;
      saveSetting(key, value);

      if (key === "reduceMotion") {
        document.documentElement.style.setProperty(
          "--duration-base",
          input.checked ? "0ms" : "250ms"
        );
      }

      showToast({ type: "success", title: "Settings saved" });
    });
  });
}

function initSectionNavigation() {
  const navLinks = document.querySelectorAll("[data-settings-nav]");
  const sections = Array.from(navLinks).map((link) =>
    document.getElementById(link.dataset.settingsNav)
  );

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((l) => l.classList.remove("is-active"));
      link.classList.add("is-active");
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle(
            "is-active",
            link.dataset.settingsNav === entry.target.id
          );
        });
      });
    },
    { rootMargin: "-40% 0px -50% 0px" }
  );

  sections.forEach((section) => {
    if (section) observer.observe(section);
  });
}

function initDeleteAccountModal() {
  const modal = document.querySelector("[data-delete-modal]");
  const openBtn = document.querySelector("[data-open-delete-modal]");
  const confirmInput = document.querySelector("[data-delete-confirm-input]");
  const confirmBtn = document.querySelector("[data-confirm-delete]");
  if (!modal) return;

  initModalDismissal(modal);
  openBtn?.addEventListener("click", () => openModal(modal));

  confirmInput?.addEventListener("input", () => {
    confirmBtn.disabled = confirmInput.value.trim() !== "DELETE";
  });

  confirmBtn?.addEventListener("click", () => {
    if (confirmInput.value.trim() !== "DELETE") return;
    closeModal(modal);
    confirmInput.value = "";
    confirmBtn.disabled = true;
    showToast({
      type: "info",
      title: "Deletion request received",
      message: "This is a demo, no account was actually deleted.",
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initThemeOptions();
  initToggleSettings();
  initSectionNavigation();
  initDeleteAccountModal();
});
