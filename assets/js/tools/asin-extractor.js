(function () {
  "use strict";
  var inputEl = document.getElementById("ae-input");
  if (!inputEl) return;

  var outputEl = document.getElementById("ae-output");
  var countEl = document.getElementById("ae-count");
  var extractBtn = document.getElementById("ae-extract");

  var PATTERNS = [
    /\/dp\/([A-Z0-9]{10})/i,
    /\/gp\/product\/([A-Z0-9]{10})/i,
    /\/gp\/aw\/d\/([A-Z0-9]{10})/i,
    /[?&]asin=([A-Z0-9]{10})/i,
    /\b(B0[A-Z0-9]{8})\b/i,
  ];

  function extractOne(line) {
    for (var i = 0; i < PATTERNS.length; i++) {
      var m = line.match(PATTERNS[i]);
      if (m) return m[1].toUpperCase();
    }
    return null;
  }

  function run() {
    var lines = inputEl.value.split(/\r?\n/);
    var found = [];
    var seen = {};
    lines.forEach(function (line) {
      line = line.trim();
      if (!line) return;
      var asin = extractOne(line);
      if (asin && !seen[asin]) {
        seen[asin] = true;
        found.push(asin);
      }
    });

    outputEl.value = found.join("\n");
    countEl.textContent = found.length + " ASIN" + (found.length === 1 ? "" : "s") + " found";
  }

  extractBtn.addEventListener("click", run);
  inputEl.addEventListener("input", run);
})();
