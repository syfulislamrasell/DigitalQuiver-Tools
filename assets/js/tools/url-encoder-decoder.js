(function () {
  "use strict";
  var modeWrap = document.getElementById("url-mode");
  if (!modeWrap) return;

  var input = document.getElementById("url-input");
  var inputLabel = document.getElementById("url-input-label");
  var outputLabel = document.getElementById("url-output-label");
  var output = document.getElementById("url-output");
  var scopeComponent = document.getElementById("url-scope-component");
  var errorMsg = document.getElementById("url-error");
  var mode = "encode";

  function run() {
    var text = input.value;
    if (!text) {
      output.value = "";
      errorMsg.classList.remove("show");
      return;
    }
    var componentMode = scopeComponent.checked;
    try {
      if (mode === "encode") {
        output.value = componentMode ? encodeURIComponent(text) : encodeURI(text);
      } else {
        output.value = componentMode ? decodeURIComponent(text) : decodeURI(text);
      }
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
    inputLabel.textContent = mode === "encode" ? "Text to encode" : "Encoded text to decode";
    outputLabel.textContent = mode === "encode" ? "Encoded result" : "Decoded result";
    run();
  });

  input.addEventListener("input", run);
  document.querySelectorAll('input[name="url-scope"]').forEach(function (el) {
    el.addEventListener("change", run);
  });
})();
