import { toggleTheme } from "../utils/theme.js";

export function initNavigation() {
  const drawer = document.querySelector("[data-mobile-drawer]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const drawerClose = document.querySelector("[data-drawer-close]");
  const drawerOverlay = document.querySelector("[data-drawer-overlay]");

  const openDrawer = () => {
    if (!drawer) return;
    drawer.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    if (!drawer) return;
    drawer.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  menuToggle?.addEventListener("click", openDrawer);
  drawerClose?.addEventListener("click", closeDrawer);
  drawerOverlay?.addEventListener("click", closeDrawer);

  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => toggleTheme());
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDrawer();
  });
}

