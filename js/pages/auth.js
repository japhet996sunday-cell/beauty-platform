import { showToast } from "../components/toast.js";

function initPasswordToggles() {
  document.querySelectorAll("[data-password-toggle]").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const input = document.getElementById(toggle.dataset.passwordToggle);
      if (!input) return;
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      toggle.textContent = isPassword ? "Hide" : "Show";
    });
  });
}

function scorePassword(value) {
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value)) score += 1;
  if (/[0-9]/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  return score;
}

function initPasswordStrength() {
  const input = document.querySelector("[data-strength-input]");
  const bars = document.querySelectorAll("[data-strength-bar]");
  const label = document.querySelector("[data-strength-label]");
  if (!input || !bars.length) return;

  const levels = [
    { text: "Too weak", color: "var(--color-danger)" },
    { text: "Weak", color: "var(--color-danger)" },
    { text: "Fair", color: "var(--color-gold)" },
    { text: "Good", color: "var(--color-success)" },
    { text: "Strong", color: "var(--color-success)" },
  ];

  input.addEventListener("input", () => {
    const score = input.value.length === 0 ? 0 : scorePassword(input.value);
    bars.forEach((bar, index) => {
      bar.style.backgroundColor = index < score ? levels[score].color : "var(--color-border)";
    });
    if (label) label.textContent = input.value.length === 0 ? "" : levels[score].text;
  });
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setFieldError(field, message) {
  const input = field.querySelector(".field-input");
  const errorEl = field.querySelector(".field-error");
  if (input) input.classList.toggle("is-invalid", Boolean(message));
  if (errorEl) errorEl.textContent = message || "";
}

function initFormValidation() {
  const form = document.querySelector("[data-auth-form]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let isValid = true;

    form.querySelectorAll("[data-field]").forEach((field) => {
      const input = field.querySelector(".field-input");
      if (!input) return;
      const value = input.value.trim();
      const rule = field.dataset.field;

      if (rule === "required" && value.length === 0) {
        setFieldError(field, "This field is required.");
        isValid = false;
      } else if (rule === "email" && !validateEmail(value)) {
        setFieldError(field, "Enter a valid email address.");
        isValid = false;
      } else if (rule === "password" && value.length < 8) {
        setFieldError(field, "Password must be at least 8 characters.");
        isValid = false;
      } else {
        setFieldError(field, "");
      }
    });

    if (isValid) {
      showToast({
        type: "success",
        title: form.dataset.successTitle || "Success",
        message: form.dataset.successMessage || "",
      });
      form.reset();
      document.querySelectorAll("[data-strength-bar]").forEach((bar) => {
        bar.style.backgroundColor = "var(--color-border)";
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initPasswordToggles();
  initPasswordStrength();
  initFormValidation();
});

