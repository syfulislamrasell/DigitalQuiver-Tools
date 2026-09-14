(function () {
  "use strict";
  var titleInput = document.getElementById("mt-title");
  if (!titleInput) return;

  var urlInput = document.getElementById("mt-url");
  var descInput = document.getElementById("mt-desc");
  var descCount = document.getElementById("mt-desc-count");
  var authorInput = document.getElementById("mt-author");
  var keywordsInput = document.getElementById("mt-keywords");
  var robotsSelect = document.getElementById("mt-robots");
  var ogTypeSelect = document.getElementById("mt-ogtype");
  var imageInput = document.getElementById("mt-image");
  var output = document.getElementById("mt-output");

  function escapeAttr(s) {
    return (s || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function update() {
    descCount.textContent = descInput.value.length;
    var title = escapeAttr(titleInput.value) || "Page Title";
    var desc = escapeAttr(descInput.value);
    var url = escapeAttr(urlInput.value);
    var author = escapeAttr(authorInput.value);
    var keywords = escapeAttr(keywordsInput.value);

    var lines = [];
    lines.push("<title>" + title + "</title>");
    if (desc) lines.push('<meta name="description" content="' + desc + '">');
    if (keywords) lines.push('<meta name="keywords" content="' + keywords + '">');
    if (author) lines.push('<meta name="author" content="' + author + '">');
    lines.push('<meta name="robots" content="' + robotsSelect.value + '">');
    if (url) lines.push('<link rel="canonical" href="' + url + '">');
    lines.push("");
    lines.push('<meta property="og:type" content="' + ogTypeSelect.value + '">');
    lines.push('<meta property="og:title" content="' + title + '">');
    if (desc) lines.push('<meta property="og:description" content="' + desc + '">');
    if (url) lines.push('<meta property="og:url" content="' + url + '">');
    if (imageInput.value) lines.push('<meta property="og:image" content="' + escapeAttr(imageInput.value) + '">');
    lines.push("");
    lines.push('<meta name="twitter:card" content="' + (imageInput.value ? "summary_large_image" : "summary") + '">');
    lines.push('<meta name="twitter:title" content="' + title + '">');
    if (desc) lines.push('<meta name="twitter:description" content="' + desc + '">');
    if (imageInput.value) lines.push('<meta name="twitter:image" content="' + escapeAttr(imageInput.value) + '">');

    output.value = lines.join("\n");
  }

  [titleInput, urlInput, descInput, authorInput, keywordsInput, robotsSelect, ogTypeSelect, imageInput].forEach(function (el) {
    el.addEventListener("input", update);
    el.addEventListener("change", update);
  });

  update();
})();
