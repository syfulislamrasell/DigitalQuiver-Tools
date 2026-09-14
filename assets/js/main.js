/* DigitalQuiver Tools — shared site behaviour (home search + copy buttons) */
(function () {
  "use strict";

  // ---- Light / dark theme toggle ----
  var themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var isLight = document.documentElement.getAttribute("data-theme") === "light";
      var next = isLight ? "dark" : "light";
      if (next === "light") {
        document.documentElement.setAttribute("data-theme", "light");
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
      try { localStorage.setItem("dq-theme", next); } catch (e) { /* no-op */ }
    });
  }

  // ---- Mobile header menu toggle ----
  var navToggle = document.getElementById("nav-toggle");
  var headerNav = document.getElementById("header-nav");
  if (navToggle && headerNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = headerNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    headerNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        headerNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---- Copy-to-clipboard: any element with [data-copy] copies the text
  // content/value of the element referenced by its value (a CSS selector). ----
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-copy]");
    if (!btn) return;
    var targetSel = btn.getAttribute("data-copy");
    var target = document.querySelector(targetSel);
    if (!target) return;
    var text = "value" in target ? target.value : target.textContent;
    if (!text) return;

    var done = function () {
      var original = btn.getAttribute("data-label") || btn.textContent;
      btn.setAttribute("data-label", original);
      btn.textContent = "Copied!";
      btn.classList.add("copied");
      setTimeout(function () {
        btn.textContent = original;
        btn.classList.remove("copied");
      }, 1500);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done).catch(function () {
        fallbackCopy(text);
        done();
      });
    } else {
      fallbackCopy(text);
      done();
    }
  });

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (err) { /* no-op */ }
    document.body.removeChild(ta);
  }

  // ---- Shared helper: human-readable file size ----
  window.DQFormatBytes = function (bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  // ---- Homepage live search ----
  var searchInput = document.getElementById("tool-search");
  if (searchInput) {
    var cards = Array.prototype.slice.call(document.querySelectorAll(".tool-card"));
    var sections = Array.prototype.slice.call(document.querySelectorAll(".category-section"));
    var countEl = document.querySelector(".search-count");
    var noResults = document.querySelector(".no-results");

    var applyFilter = function () {
      var q = searchInput.value.trim().toLowerCase();
      var visible = 0;
      sections.forEach(function (section) {
        var visibleInSection = 0;
        section.querySelectorAll(".tool-card").forEach(function (card) {
          var name = (card.getAttribute("data-name") || "").toLowerCase();
          var desc = (card.getAttribute("data-desc") || "").toLowerCase();
          var match = !q || name.indexOf(q) !== -1 || desc.indexOf(q) !== -1;
          card.style.display = match ? "" : "none";
          if (match) { visibleInSection++; visible++; }
        });
        section.style.display = visibleInSection ? "" : "none";
      });
      if (countEl) {
        countEl.textContent = q ? (visible + " tool" + (visible === 1 ? "" : "s") + " found") : "";
      }
      if (noResults) {
        noResults.style.display = visible === 0 ? "block" : "none";
      }
    };

    searchInput.addEventListener("input", applyFilter);

    // Support ?q= deep link from other pages
    var params = new URLSearchParams(window.location.search);
    if (params.get("q")) {
      searchInput.value = params.get("q");
      applyFilter();
    }
  }
})();
