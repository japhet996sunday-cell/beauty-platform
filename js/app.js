import { initTheme } from "./utils/theme.js";
import { initRippleEffect } from "./utils/ripple.js";
import { initNavigation } from "./components/navigation.js";

function bootstrap() {
  initTheme();
  initNavigation();
  initRippleEffect();
}

document.addEventListener("DOMContentLoaded", bootstrap);

