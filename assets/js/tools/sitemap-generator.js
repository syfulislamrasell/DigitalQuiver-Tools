(function () {
  "use strict";
  var urlsInput = document.getElementById("sm-urls");
  if (!urlsInput) return;

  var changefreqSelect = document.getElementById("sm-changefreq");
  var prioritySelect = document.getElementById("sm-priority");
  var lastmodCheck = document.getElementById("sm-lastmod");
  var generateBtn = document.getElementById("sm-generate");
  var errorMsg = document.getElementById("sm-error");
  var output = document.getElementById("sm-output");

  function escapeXml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  }

  function generate() {
    var urls = urlsInput.value.split("\n").map(function (l) { return l.trim(); }).filter(Boolean);
    if (urls.length === 0) {
      errorMsg.textContent = "Please enter at least one URL.";
      errorMsg.classList.add("show");
      output.value = "";
      return;
    }
    var invalid = urls.filter(function (u) { return !/^https?:\/\//i.test(u); });
    if (invalid.length) {
      errorMsg.textContent = 'Every URL should start with "http://" or "https://". Check: ' + invalid[0];
      errorMsg.classList.add("show");
      output.value = "";
      return;
    }
    errorMsg.classList.remove("show");

    var today = new Date().toISOString().slice(0, 10);
    var entries = urls.map(function (u) {
      var parts = ["  <url>", "    <loc>" + escapeXml(u) + "</loc>"];
      if (lastmodCheck.checked) parts.push("    <lastmod>" + today + "</lastmod>");
      if (changefreqSelect.value) parts.push("    <changefreq>" + changefreqSelect.value + "</changefreq>");
      if (prioritySelect.value) parts.push("    <priority>" + prioritySelect.value + "</priority>");
      parts.push("  </url>");
      return parts.join("\n");
    });

    output.value = '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      entries.join("\n") + "\n</urlset>";
  }

  generateBtn.addEventListener("click", generate);
})();
