(function () {
  "use strict";
  var input = document.getElementById("dl-input");
  if (!input) return;

  var output = document.getElementById("dl-output");
  var ignoreCase = document.getElementById("dl-ignorecase");
  var trim = document.getElementById("dl-trim");
  var ignoreBlank = document.getElementById("dl-ignoreblank");
  var stats = document.getElementById("dl-stats");
  var runBtn = document.getElementById("dl-run");
  var clearBtn = document.getElementById("dl-clear");

  function run() {
    var lines = input.value.split("\n");
    var total = lines.length;
    var seen = Object.create(null);
    var result = [];

    lines.forEach(function (rawLine) {
      var line = trim.checked ? rawLine.trim() : rawLine;
      if (ignoreBlank.checked && line.trim() === "") return;
      var key = ignoreCase.checked ? line.toLowerCase() : line;
      if (seen[key]) return;
      seen[key] = true;
      result.push(line);
    });

    output.value = result.join("\n");
    stats.textContent = "Kept " + result.length + " unique line(s) out of " + total + ". Removed " + (total - result.length) + ".";
  }

  runBtn.addEventListener("click", run);
  clearBtn.addEventListener("click", function () {
    input.value = "";
    output.value = "";
    stats.textContent = "";
    input.focus();
  });
})();
