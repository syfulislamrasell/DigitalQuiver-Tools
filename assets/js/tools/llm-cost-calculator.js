(function () {
  "use strict";
  var presetSelect = document.getElementById("lcc-preset");
  if (!presetSelect) return;
  var inPrice = document.getElementById("lcc-in-price");
  var outPrice = document.getElementById("lcc-out-price");
  var inTokens = document.getElementById("lcc-in-tokens");
  var outTokens = document.getElementById("lcc-out-tokens");
  var requests = document.getElementById("lcc-requests");
  var perRequestEl = document.getElementById("lcc-cost-per-request");
  var totalEl = document.getElementById("lcc-total-cost");

  function formatMoney(n) {
    if (n < 0.01 && n > 0) return "$" + n.toFixed(6);
    return "$" + n.toFixed(4);
  }

  function calculate() {
    var ip = parseFloat(inPrice.value) || 0;
    var op = parseFloat(outPrice.value) || 0;
    var it = parseFloat(inTokens.value) || 0;
    var ot = parseFloat(outTokens.value) || 0;
    var n = Math.max(1, parseFloat(requests.value) || 1);

    var perRequest = (it / 1000000) * ip + (ot / 1000000) * op;
    var total = perRequest * n;

    perRequestEl.textContent = formatMoney(perRequest);
    totalEl.textContent = formatMoney(total);
  }

  presetSelect.addEventListener("change", function () {
    if (!presetSelect.value) return;
    var parts = presetSelect.value.split(",");
    inPrice.value = parts[0];
    outPrice.value = parts[1];
    calculate();
  });

  [inPrice, outPrice, inTokens, outTokens, requests].forEach(function (el) {
    el.addEventListener("input", calculate);
  });
  calculate();
})();
