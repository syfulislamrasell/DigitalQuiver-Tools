(function () {
  "use strict";
  var windowSelect = document.getElementById("cwc-window");
  if (!windowSelect) return;
  var customWrap = document.getElementById("cwc-custom-wrap");
  var customInput = document.getElementById("cwc-custom");
  var usedInput = document.getElementById("cwc-used");
  var remainingEl = document.getElementById("cwc-remaining");
  var percentEl = document.getElementById("cwc-percent");

  function windowSize() {
    if (windowSelect.value === "custom") return parseFloat(customInput.value) || 0;
    return parseFloat(windowSelect.value) || 0;
  }

  function calculate() {
    var size = windowSize();
    var used = parseFloat(usedInput.value) || 0;
    if (size <= 0) {
      remainingEl.textContent = "—";
      percentEl.textContent = "—";
      return;
    }
    var remaining = Math.max(0, size - used);
    var percent = Math.min(100, (used / size) * 100);
    remainingEl.textContent = Math.round(remaining).toLocaleString();
    percentEl.textContent = percent.toFixed(1) + "%";
  }

  windowSelect.addEventListener("change", function () {
    customWrap.style.display = windowSelect.value === "custom" ? "block" : "none";
    calculate();
  });
  [customInput, usedInput].forEach(function (el) {
    el.addEventListener("input", calculate);
  });
  calculate();
})();
