
(function () {
  "use strict";

  const STORAGE_KEY = "segfaulter-theme";
  const DEFAULT_THEME = "dark";

  const root = document.documentElement;

  const themeLinks = document.querySelectorAll(
    "link[data-theme-stylesheet]"
  );

  const originalStylesheet = document.querySelector(
    'link[href*="/assets/css/main.css"]'
  );

  let currentTheme = DEFAULT_THEME;
  let toggleButton = null;

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

  function updateButton() {
    if (!toggleButton) return;

    const dark = currentTheme === "dark";

    toggleButton.textContent = dark ? "☀" : "☾";
    toggleButton.title = dark
      ? "Switch to light mode"
      : "Switch to dark mode";

    toggleButton.setAttribute("aria-label", toggleButton.title);
  }

  function applyTheme(theme) {
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
      // Switching still works if storage is unavailable.
    }

    updateButton();
  }

  // Restore all navigation links on wide screens.
  function restoreWideNavigation() {
    if (window.innerWidth < 1200) return;

    const nav = document.getElementById("site-nav");
    if (!nav) return;

    const visible = nav.querySelector(".visible-links");
    const hidden = nav.querySelector(".hidden-links");
    const menuButton = nav.querySelector(".greedy-nav__toggle");

    if (visible && hidden) {
      while (hidden.firstElementChild) {
        visible.appendChild(hidden.firstElementChild);
      }

      hidden.classList.add("hidden");
    }

    if (menuButton) {
      menuButton.classList.add("hidden");
    }
  }

  // Put the theme button outside nav#site-nav.
  function createToggleButton() {
    const nav = document.getElementById("site-nav");

    if (!nav || !nav.parentElement) return;

    const existing = document.getElementById("theme-toggle");

    if (existing) {
      toggleButton = existing;
      updateButton();
      return;
    }

    toggleButton = document.createElement("button");

    toggleButton.id = "theme-toggle";
    toggleButton.className = "theme-toggle";
    toggleButton.type = "button";

    toggleButton.addEventListener("click", function () {
      applyTheme(
        currentTheme === "dark" ? "light" : "dark"
      );
    });

    // Append to .masthead__menu, NOT nav#site-nav.
    nav.parentElement.appendChild(toggleButton);

    updateButton();
  }

  // Apply saved preference immediately.
  applyTheme(getSavedTheme());

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      createToggleButton,
      { once: true }
    );
  } else {
    createToggleButton();
  }

  // Run after Minimal Mistakes' navigation script.
  window.addEventListener("load", function () {
    setTimeout(restoreWideNavigation, 100);
  });

  window.addEventListener("resize", function () {
    setTimeout(restoreWideNavigation, 150);
  });

})();
