(function () {
  "use strict";
  var modeWrap = document.getElementById("pc-mode");
  if (!modeWrap) return;

  var panels = {
    of: document.getElementById("pc-panel-of"),
    is: document.getElementById("pc-panel-is"),
    change: document.getElementById("pc-panel-change"),
  };
  var resultEl = document.getElementById("pc-result");
  var labelEl = document.getElementById("pc-result-label");
  var mode = "of";

  var ofX = document.getElementById("pc-of-x");
  var ofY = document.getElementById("pc-of-y");
  var isX = document.getElementById("pc-is-x");
  var isY = document.getElementById("pc-is-y");
  var chFrom = document.getElementById("pc-ch-from");
  var chTo = document.getElementById("pc-ch-to");

  function fmt(n) {
    if (!isFinite(n)) return "—";
    return Math.round(n * 100) / 100;
  }

  function calc() {
    if (mode === "of") {
      var x = parseFloat(ofX.value) || 0;
      var y = parseFloat(ofY.value) || 0;
      resultEl.textContent = fmt((x / 100) * y);
      labelEl.textContent = x + "% of " + y;
    } else if (mode === "is") {
      var v = parseFloat(isX.value) || 0;
      var total = parseFloat(isY.value) || 0;
      resultEl.textContent = total === 0 ? "—" : fmt((v / total) * 100) + "%";
      labelEl.textContent = v + " is what % of " + total;
    } else {
      var from = parseFloat(chFrom.value) || 0;
      var to = parseFloat(chTo.value) || 0;
      var change = from === 0 ? NaN : ((to - from) / Math.abs(from)) * 100;
      resultEl.textContent = isNaN(change) ? "—" : (change >= 0 ? "+" : "") + fmt(change) + "%";
      labelEl.textContent = "Change from " + from + " to " + to;
    }
  }

  modeWrap.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-mode]");
    if (!btn) return;
    Array.prototype.forEach.call(modeWrap.querySelectorAll("button"), function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    mode = btn.getAttribute("data-mode");
    Object.keys(panels).forEach(function (k) { panels[k].style.display = k === mode ? "" : "none"; });
    calc();
  });

  [ofX, ofY, isX, isY, chFrom, chTo].forEach(function (el) { el.addEventListener("input", calc); });
  calc();
})();
