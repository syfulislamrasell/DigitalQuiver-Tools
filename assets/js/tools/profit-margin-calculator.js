(function () {
  "use strict";
  var costInput = document.getElementById("pm-cost");
  if (!costInput) return;

  var priceInput = document.getElementById("pm-price");
  var profitEl = document.getElementById("pm-profit");
  var marginEl = document.getElementById("pm-margin");
  var markupEl = document.getElementById("pm-markup");

  function calc() {
    var cost = parseFloat(costInput.value) || 0;
    var price = parseFloat(priceInput.value) || 0;
    var profit = price - cost;
    var margin = price > 0 ? (profit / price) * 100 : 0;
    var markup = cost > 0 ? (profit / cost) * 100 : 0;

    profitEl.textContent = profit.toFixed(2);
    marginEl.textContent = margin.toFixed(1) + "%";
    markupEl.textContent = markup.toFixed(1) + "%";
  }

  [costInput, priceInput].forEach(function (el) { el.addEventListener("input", calc); });
  calc();
})();
