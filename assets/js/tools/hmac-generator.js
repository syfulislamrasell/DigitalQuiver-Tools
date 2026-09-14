(function () {
  "use strict";
  var messageInput = document.getElementById("hm-message");
  if (!messageInput) return;

  var keyInput = document.getElementById("hm-key");
  var algoSelect = document.getElementById("hm-algo");
  var output = document.getElementById("hm-output");

  function toHex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), function (b) {
      return b.toString(16).padStart(2, "0");
    }).join("");
  }

  async function update() {
    var message = messageInput.value;
    var key = keyInput.value;
    if (!message || !key) {
      output.value = "";
      return;
    }
    var cryptoKey = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(key),
      { name: "HMAC", hash: { name: algoSelect.value } },
      false,
      ["sign"]
    );
    var signature = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(message));
    output.value = toHex(signature);
  }

  [messageInput, keyInput, algoSelect].forEach(function (el) {
    el.addEventListener("input", update);
    el.addEventListener("change", update);
  });
})();
