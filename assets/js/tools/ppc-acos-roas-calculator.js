(function () {
  "use strict";
  var spendInput = document.getElementById("pc-spend");
  if (!spendInput) return;

  var salesInput = document.getElementById("pc-sales");
  var marginInput = document.getElementById("pc-margin");

  var acosEl = document.getElementById("pc-acos");
  var roasEl = document.getElementById("pc-roas");
  var breakevenEl = document.getElementById("pc-breakeven");
  var verdictEl = document.getElementById("pc-verdict");

  function calc() {
    var spend = parseFloat(spendInput.value) || 0;
    var sales = parseFloat(salesInput.value) || 0;
    var margin = parseFloat(marginInput.value) || 0;

    var acos = sales > 0 ? (spend / sales) * 100 : 0;
    var roas = spend > 0 ? sales / spend : 0;

    acosEl.textContent = acos.toFixed(1) + "%";
    roasEl.textContent = roas.toFixed(2) + "x";
    breakevenEl.textContent = margin.toFixed(1) + "%";

    if (marginInput.value === "") {
      verdictEl.textContent = "";
    } else if (acos <= margin) {
      verdictEl.textContent = "Profitable — your ACOS is at or below your break-even point.";
      verdictEl.style.color = "var(--success)";
    } else {
      verdictEl.textContent = "Losing money on ads — your ACOS is above your break-even point.";
      verdictEl.style.color = "var(--danger)";
    }
  }

  [spendInput, salesInput, marginInput].forEach(function (el) { el.addEventListener("input", calc); });
  calc();
})();
