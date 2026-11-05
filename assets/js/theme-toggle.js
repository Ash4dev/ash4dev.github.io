
(function () {
  "use strict";

  const STORAGE_KEY = "segfaulter-theme";
  const DEFAULT_THEME = "dark";
  const DESKTOP_WIDTH = 1200;

  const root = document.documentElement;

  const themeLinks = document.querySelectorAll(
    "link[data-theme-stylesheet]"
  );

  const originalStylesheet = document.querySelector(
    'link[href*="/assets/css/main.css"]'
  );

  let currentTheme = DEFAULT_THEME;
  let toggleButton = null;
  let resizeTimer = null;

  function getSavedTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      return saved === "light" || saved === "dark"
        ? saved
        : DEFAULT_THEME;
    } catch (error) {
      return DEFAULT_THEME;
    }
  }

  function updateAvatar() {
    const avatar = document.querySelector(
      ".author__avatar img"
    );

    const paths = window.siteAvatarPaths;

    if (!avatar || !paths) return;

    const newSource = paths[currentTheme];

    if (!newSource) return;

    if (avatar.getAttribute("src") !== newSource) {
      avatar.removeAttribute("srcset");
      avatar.src = newSource;
    }
  }

  function updateButton() {
    if (!toggleButton) return;

    const isDark = currentTheme === "dark";

    toggleButton.textContent = isDark ? "☀" : "☾";
    toggleButton.title = isDark
      ? "Switch to light mode"
      : "Switch to dark mode";

    toggleButton.setAttribute(
      "aria-label",
      toggleButton.title
    );
  }

  function applyTheme(theme) {
    if (theme !== "light" && theme !== "dark") return;

    currentTheme = theme;

    if (originalStylesheet) {
      originalStylesheet.disabled = true;
    }

    themeLinks.forEach(function (link) {
      link.disabled = link.dataset.themeStylesheet !== theme;
    });

    root.dataset.theme = theme;

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // Continue without persistent storage.
    }

    updateAvatar();
    updateButton();
  }

  function createToggleButton() {
    const nav = document.getElementById("site-nav");

    if (!nav || !nav.parentElement) return;

    if (document.getElementById("theme-toggle")) return;

    toggleButton = document.createElement("button");

    toggleButton.id = "theme-toggle";
    toggleButton.type = "button";

    toggleButton.addEventListener("click", function () {
      applyTheme(
        currentTheme === "dark" ? "light" : "dark"
      );
    });

    // Keep toggle outside the navigation.
    nav.parentElement.appendChild(toggleButton);

    updateButton();
    updateAvatar();
  }

  // Restore all links on a sufficiently wide screen.
  function restoreDesktopNavigation() {
    if (window.innerWidth < DESKTOP_WIDTH) return;

    const nav = document.getElementById("site-nav");
    if (!nav) return;

    const visible = nav.querySelector(".visible-links");
    const hidden = nav.querySelector(".hidden-links");
    const menuButton = nav.querySelector(
      ".greedy-nav__toggle"
    );

    if (!visible || !hidden) return;

    // Move every collapsed link back into the visible list.
    while (hidden.firstElementChild) {
      visible.appendChild(hidden.firstElementChild);
    }

    hidden.classList.add("hidden");

    if (menuButton) {
      menuButton.classList.add("hidden");
    }
  }

  function scheduleNavigationCheck() {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(
      restoreDesktopNavigation,
      250
    );
  }

  // Restore saved theme.
  applyTheme(getSavedTheme());

  // Create the toggle.
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      createToggleButton,
      { once: true }
    );
  } else {
    createToggleButton();
  }

  // Wait for Minimal Mistakes navigation initialization.
  window.addEventListener("load", function () {
    scheduleNavigationCheck();
  });

  // Recheck after browser resizing.
  window.addEventListener(
    "resize",
    scheduleNavigationCheck
  );

})();
