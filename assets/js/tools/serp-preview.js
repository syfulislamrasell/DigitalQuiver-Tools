(function () {
  "use strict";
  var titleInput = document.getElementById("sp-title");
  if (!titleInput) return;
  var urlInput = document.getElementById("sp-url");
  var descInput = document.getElementById("sp-desc");
  var titleCount = document.getElementById("sp-title-count");
  var descCount = document.getElementById("sp-desc-count");
  var previewUrl = document.getElementById("sp-preview-url");
  var previewTitle = document.getElementById("sp-preview-title");
  var previewDesc = document.getElementById("sp-preview-desc");

  function countLabel(el, len, limit) {
    el.textContent = "(" + len + " / ~" + limit + ")";
    el.style.color = len > limit ? "#c0392b" : "";
  }

  function update() {
    var title = titleInput.value || "Your Page Title Here";
    var url = urlInput.value || "https://example.com/page";
    var desc = descInput.value || "A short, compelling summary of the page will appear here.";

    countLabel(titleCount, titleInput.value.length, 60);
    countLabel(descCount, descInput.value.length, 160);

    previewTitle.textContent = title;
    previewDesc.textContent = desc;

    try {
      var u = new URL(url);
      var segments = u.pathname.split("/").filter(function (s) { return s.length > 0; });
      var breadcrumb = u.hostname + (segments.length ? " › " + segments.join(" › ") : "");
      previewUrl.textContent = breadcrumb;
    } catch (e) {
      previewUrl.textContent = url;
    }
  }

  [titleInput, urlInput, descInput].forEach(function (el) {
    el.addEventListener("input", update);
  });
  update();
})();
