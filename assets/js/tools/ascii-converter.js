(function () {
  "use strict";
  var modeWrap = document.getElementById("ac-mode");
  if (!modeWrap) return;

  var panelTo = document.getElementById("ac-panel-to");
  var panelFrom = document.getElementById("ac-panel-from");
  var textInput = document.getElementById("ac-text-input");
  var format = document.getElementById("ac-format");
  var sep = document.getElementById("ac-sep");
  var codeOutput = document.getElementById("ac-code-output");
  var codeInput = document.getElementById("ac-code-input");
  var decodeFormat = document.getElementById("ac-decode-format");
  var textOutput = document.getElementById("ac-text-output");
  var errorMsg = document.getElementById("ac-error");

  function separator() {
    return sep.value === "space" ? " " : sep.value === "comma" ? "," : "";
  }

  function toCodes() {
    var text = textInput.value;
    var codes = Array.from(text).map(function (ch) {
      var cp = ch.codePointAt(0);
      if (format.value === "hex") return cp.toString(16).toUpperCase();
      if (format.value === "bin") return cp.toString(2);
      return String(cp);
    });
    codeOutput.value = codes.join(separator());
  }

  function fromCodes() {
    var raw = codeInput.value.trim();
    if (!raw) {
      textOutput.value = "";
      errorMsg.classList.remove("show");
      return;
    }
    var tokens = raw.split(/[\s,]+/).filter(Boolean);
    var base = decodeFormat.value === "hex" ? 16 : decodeFormat.value === "bin" ? 2 : 10;
    var validPattern = decodeFormat.value === "hex" ? /^[0-9a-fA-F]+$/ : decodeFormat.value === "bin" ? /^[01]+$/ : /^[0-9]+$/;
    try {
      var chars = tokens.map(function (tok) {
        var clean = tok.replace(/^0x/i, "");
        if (!validPattern.test(clean)) throw new Error("bad token");
        var num = parseInt(clean, base);
        if (isNaN(num)) throw new Error("bad token");
        return String.fromCodePoint(num);
      });
      textOutput.value = chars.join("");
      errorMsg.classList.remove("show");
    } catch (e) {
      errorMsg.classList.add("show");
      textOutput.value = "";
    }
  }

  modeWrap.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-mode]");
    if (!btn) return;
    Array.prototype.forEach.call(modeWrap.querySelectorAll("button"), function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    var mode = btn.getAttribute("data-mode");
    panelTo.style.display = mode === "to" ? "" : "none";
    panelFrom.style.display = mode === "from" ? "" : "none";
  });

  [textInput, format, sep].forEach(function (el) { el.addEventListener("input", toCodes); });
  format.addEventListener("change", toCodes);
  sep.addEventListener("change", toCodes);
  codeInput.addEventListener("input", fromCodes);
  decodeFormat.addEventListener("change", fromCodes);

  toCodes();
})();
