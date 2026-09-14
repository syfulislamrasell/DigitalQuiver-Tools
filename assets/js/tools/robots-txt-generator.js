(function () {
  "use strict";
  var allowRadio = document.getElementById("rg-mode-allow");
  if (!allowRadio) return;

  var customRadio = document.getElementById("rg-mode-custom");
  var customFields = document.getElementById("rg-custom-fields");
  var disallowInput = document.getElementById("rg-disallow");
  var allowInput = document.getElementById("rg-allow");
  var sitemapInput = document.getElementById("rg-sitemap");
  var output = document.getElementById("rg-output");

  function linesOf(textarea) {
    return textarea.value.split("\n").map(function (l) { return l.trim(); }).filter(Boolean);
  }

  function update() {
    customFields.style.display = customRadio.checked ? "" : "none";
    var lines = ["User-agent: *"];

    if (allowRadio.checked) {
      lines.push("Allow: /");
    } else {
      linesOf(allowInput).forEach(function (p) { lines.push("Allow: " + p); });
      var disallows = linesOf(disallowInput);
      if (disallows.length === 0) lines.push("Disallow:");
      disallows.forEach(function (p) { lines.push("Disallow: " + p); });
    }

    if (sitemapInput.value.trim()) {
      lines.push("");
      lines.push("Sitemap: " + sitemapInput.value.trim());
    }

    output.value = lines.join("\n");
  }

  [allowRadio, customRadio, disallowInput, allowInput, sitemapInput].forEach(function (el) {
    el.addEventListener("input", update);
    el.addEventListener("change", update);
  });

  update();
})();
