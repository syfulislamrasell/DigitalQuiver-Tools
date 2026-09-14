(function () {
  "use strict";
  var input = document.getElementById("sh-input");
  if (!input) return;

  var output = document.getElementById("sh-output");

  function toHex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), function (b) {
      return b.toString(16).padStart(2, "0");
    }).join("");
  }

  async function update() {
    var text = input.value;
    if (!text) {
      output.value = "";
      return;
    }
    var bytes = new TextEncoder().encode(text);
    var digest = await crypto.subtle.digest("SHA-256", bytes);
    output.value = toHex(digest);
  }

  input.addEventListener("input", update);
})();
