(function () {
  "use strict";
  var input = document.getElementById("ua-input");
  if (!input) return;

  var useMineBtn = document.getElementById("ua-use-mine");
  var browserEl = document.getElementById("ua-browser");
  var osEl = document.getElementById("ua-os");
  var platformEl = document.getElementById("ua-platform");
  var engineEl = document.getElementById("ua-engine");

  function parse() {
    var ua = input.value.trim();
    if (!ua) {
      browserEl.textContent = osEl.textContent = platformEl.textContent = engineEl.textContent = "—";
      return;
    }
    var result = bowser.parse(ua);
    browserEl.textContent = [result.browser.name, result.browser.version].filter(Boolean).join(" ") || "Unknown";
    osEl.textContent = [result.os.name, result.os.version].filter(Boolean).join(" ") || "Unknown";
    var platform = result.platform.type ? result.platform.type.charAt(0).toUpperCase() + result.platform.type.slice(1) : "Unknown";
    if (result.platform.vendor || result.platform.model) {
      platform += " (" + [result.platform.vendor, result.platform.model].filter(Boolean).join(" ") + ")";
    }
    platformEl.textContent = platform;
    engineEl.textContent = [result.engine.name, result.engine.version].filter(Boolean).join(" ") || "Unknown";
  }

  useMineBtn.addEventListener("click", function () {
    input.value = navigator.userAgent;
    parse();
  });

  input.addEventListener("input", parse);

  input.value = navigator.userAgent;
  parse();
})();
