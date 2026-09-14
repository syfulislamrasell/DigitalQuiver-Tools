(function () {
  "use strict";
  var exprInput = document.getElementById("cg-expr");
  if (!exprInput) return;

  var errorMsg = document.getElementById("cg-error");
  var explainEl = document.getElementById("cg-explain");
  var buildBtn = document.getElementById("cg-build");
  var presetButtons = document.querySelectorAll("[data-preset]");

  var fields = {
    minute: document.getElementById("cg-minute"),
    hour: document.getElementById("cg-hour"),
    dom: document.getElementById("cg-dom"),
    month: document.getElementById("cg-month"),
    dow: document.getElementById("cg-dow"),
  };

  function explain() {
    var expr = exprInput.value.trim();
    if (!expr) {
      errorMsg.classList.remove("show");
      explainEl.textContent = "—";
      return;
    }
    try {
      explainEl.textContent = window.cronstrue.toString(expr);
      errorMsg.classList.remove("show");
    } catch (e) {
      errorMsg.textContent = "Couldn't parse that cron expression. Check it has 5 space-separated fields.";
      errorMsg.classList.add("show");
      explainEl.textContent = "—";
    }
  }

  function setExpr(expr) {
    exprInput.value = expr;
    explain();
    var parts = expr.split(/\s+/);
    if (parts.length === 5) {
      fields.minute.value = parts[0];
      fields.hour.value = parts[1];
      fields.dom.value = parts[2];
      fields.month.value = parts[3];
      fields.dow.value = parts[4];
    }
  }

  buildBtn.addEventListener("click", function () {
    var expr = [fields.minute.value, fields.hour.value, fields.dom.value, fields.month.value, fields.dow.value]
      .map(function (v) { return v.trim() || "*"; }).join(" ");
    exprInput.value = expr;
    explain();
  });

  presetButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setExpr(btn.getAttribute("data-preset"));
    });
  });

  exprInput.addEventListener("input", explain);
  explain();
})();
