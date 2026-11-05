
(function () {
  "use strict";

  function openSection(id) {
    const section = document.getElementById(id);

    if (
      section &&
      section.matches("details.taxonomy__collapsible")
    ) {
      section.open = true;
    }
  }

  // Open the relevant section when clicking the index.
  document.addEventListener("click", function (event) {
    const link = event.target.closest(
      ".taxonomy__index a"
    );

    if (!link) return;

    const id = decodeURIComponent(
      link.getAttribute("href").slice(1)
    );

    openSection(id);
  });

  // Handle direct URLs containing a section anchor.
  function openFromHash() {
    if (!window.location.hash) return;

    const id = decodeURIComponent(
      window.location.hash.slice(1)
    );

    openSection(id);
  }

  document.addEventListener(
    "DOMContentLoaded",
    openFromHash
  );

  window.addEventListener("hashchange", openFromHash);

})();
