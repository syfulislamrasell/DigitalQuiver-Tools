(function () {
  "use strict";
  var output = document.getElementById("uu-output");
  if (!output) return;

  var countInput = document.getElementById("uu-count");
  var caseSelect = document.getElementById("uu-case");
  var hyphensCheck = document.getElementById("uu-hyphens");
  var bracesCheck = document.getElementById("uu-braces");
  var generateBtn = document.getElementById("uu-generate");

  function uuidv4() {
    if (window.crypto && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    var bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    var hex = Array.prototype.map.call(bytes, function (b) {
      return b.toString(16).padStart(2, "0");
    }).join("");
    return hex.slice(0, 8) + "-" + hex.slice(8, 12) + "-" + hex.slice(12, 16) + "-" + hex.slice(16, 20) + "-" + hex.slice(20);
  }

  function generate() {
    var count = Math.min(100, Math.max(1, parseInt(countInput.value, 10) || 1));
    var lines = [];
    for (var i = 0; i < count; i++) {
      var id = uuidv4();
      if (!hyphensCheck.checked) id = id.replace(/-/g, "");
      if (caseSelect.value === "upper") id = id.toUpperCase();
      if (bracesCheck.checked) id = "{" + id + "}";
      lines.push(id);
    }
    output.value = lines.join("\n");
  }

  generateBtn.addEventListener("click", generate);
  generate();
})();
