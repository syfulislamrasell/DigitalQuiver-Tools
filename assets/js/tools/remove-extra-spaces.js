(function () {
  "use strict";
  var input = document.getElementById("res-input");
  if (!input) return;

  var output = document.getElementById("res-output");
  var trimLines = document.getElementById("res-trim-lines");
  var collapseBlank = document.getElementById("res-blank-lines");
  var removeBlank = document.getElementById("res-remove-blank");
  var stats = document.getElementById("res-stats");
  var cleanBtn = document.getElementById("res-clean");
  var clearBtn = document.getElementById("res-clear");

  function clean() {
    var text = input.value;
    var before = text.length;

    // Collapse repeated horizontal whitespace (spaces/tabs) to a single space.
    var lines = text.split("\n").map(function (line) {
      var l = line.replace(/[ \t]+/g, " ");
      if (trimLines.checked) l = l.trim();
      return l;
    });

    if (removeBlank.checked) {
      lines = lines.filter(function (l) { return l.trim() !== ""; });
    } else if (collapseBlank.checked) {
      var result = [];
      var lastBlank = false;
      lines.forEach(function (l) {
        var isBlank = l.trim() === "";
        if (isBlank && lastBlank) return;
        result.push(l);
        lastBlank = isBlank;
      });
      lines = result;
    }

    var cleaned = lines.join("\n");
    output.value = cleaned;
    stats.textContent = "Removed " + Math.max(0, before - cleaned.length) + " character(s).";
  }

  cleanBtn.addEventListener("click", clean);
  clearBtn.addEventListener("click", function () {
    input.value = "";
    output.value = "";
    stats.textContent = "";
    input.focus();
  });
})();
