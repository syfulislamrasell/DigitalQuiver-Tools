(function () {
  "use strict";
  var modeWrap = document.getElementById("b64-mode");
  if (!modeWrap) return;

  var input = document.getElementById("b64-input");
  var inputLabel = document.getElementById("b64-input-label");
  var outputLabel = document.getElementById("b64-output-label");
  var output = document.getElementById("b64-output");
  var urlSafe = document.getElementById("b64-urlsafe");
  var errorMsg = document.getElementById("b64-error");
  var mode = "encode";

  function encode(text) {
    var bytes = new TextEncoder().encode(text);
    var binary = Array.prototype.map.call(bytes, function (b) { return String.fromCharCode(b); }).join("");
    var b64 = btoa(binary);
    if (urlSafe.checked) {
      b64 = b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }
    return b64;
  }

  function decode(text) {
    var normalized = text.replace(/-/g, "+").replace(/_/g, "/").trim();
    while (normalized.length % 4) normalized += "=";
    var binary = atob(normalized);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  }

  function run() {
    var text = input.value;
    if (!text) {
      output.value = "";
      errorMsg.classList.remove("show");
      return;
    }
    try {
      output.value = mode === "encode" ? encode(text) : decode(text);
      errorMsg.classList.remove("show");
    } catch (e) {
      errorMsg.classList.add("show");
      output.value = "";
    }
  }

  modeWrap.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-mode]");
    if (!btn) return;
    Array.prototype.forEach.call(modeWrap.querySelectorAll("button"), function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    mode = btn.getAttribute("data-mode");
    inputLabel.textContent = mode === "encode" ? "Text to encode" : "Base64 to decode";
    outputLabel.textContent = mode === "encode" ? "Base64 result" : "Decoded text";
    run();
  });

  input.addEventListener("input", run);
  urlSafe.addEventListener("change", run);
})();
